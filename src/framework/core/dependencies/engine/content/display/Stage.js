import DisplayObjectContainer from "./DisplayObjectContainer";
import GroupStruct from "./struct/GroupStruct";
import { Group } from "three";
import ArrayUtils from "../../../../../utils/tech/ArrayUtils";
import DisplayObject from "./DisplayObject";

export default class Stage extends DisplayObjectContainer {

    /**
     * 
     * @param { StageVO } stageVO
     */
    constructor( stageVO ) {
        super( stageVO );
    }

    //
    // GET/SET
    //

    get scene() { return this._scene; }
    set scene( value ) {
        this._scene = value;
        this._sceneListsnersAdd();
        this._groupSceneUpdate();
    }

    get camera() { return this._camera; }
    set camera( value ) { this._camera = value; }

    get dirty() { return this._dirty; }
    set dirty( value ) { this._dirty = !!value; }

    set width( value ) {
        super.width = value;
        this.x = -value * 0.5;
    }

    set height( value ) {
        super.height = value;
        this.y = value * 0.5;
    }

    /**
     * Количество  элементов на экране
     */
    get length() { return this._globalList.length; }

    get defaultGroupStruct() { return this._groupStructList[ 0 ]; }



    //
    // INIT
    //

    init() {
        super.init();
        this._initStageVars();
        this._initGroups();
    }

    _initStageVars() {
        this._width = 0;
        this._height = 0;
        this._stage = this;
        this._globalList = [];
        this._groupStructList = [];
        this._dirtyList = [];
        this.scene = this.vo.scene;
        this.camera = this.vo.camera;
    }

    _initCenterPlane() {}

    _updateProperties() {
        this._parentX = this._x;
        this._parentY = this._y;
        this._rx = this._x;
        this._ry = this._y;
    }


    //
    // CHILDREN
    //
    
    addChild( child ) {
        if ( child instanceof Stage ) {
            debugger;
            return null;
        }
        return super.addChild( child );
    }

    /**
     * 
     * @param {  } child 
     * @param {  } groupName 
     */
    addToDisplay( child ) {
        if ( this.isChildAtList( child ) ) return;
        this._childAdd( child );
    }

    removeFromDisplay( child ) {
        this._childRemove( child );
    }

    isChildAtList( child ) {
        return this._globalList.indexOf( child ) >= 0;
    }

    dirtyChildSet( child ) {
        this._dirtyList.push( child );
    }

    _childAdd( instance, parentGroupName = null ) {
        const groupName = this._childGroupNameInit( instance, instance.group || parentGroupName );
        let groupStruct = this.groupStructByNameGet( groupName );
        groupStruct = groupStruct || this._groupCreate( groupName );

        if ( instance instanceof DisplayObjectContainer ) {
            this._childAddToList( instance );
            for ( let i = 0; i < instance.list.length; i++ )  {
                const child = instance.list[ i ];
                this._childAdd( child, groupName );
            }
        } else if ( instance instanceof DisplayObject ) {
            this._childAddToList( instance );
            this._childAddToDisplay( instance, groupStruct );
        }
    }

    _childRemove( instance ) {
        if ( instance instanceof DisplayObjectContainer ) {
            this._childRemoveFromList( instance );
            for ( let i = 0; i < instance.list.length; i++ )  {
                const child = instance.list[ i ];
                this._childAdd( child, groupName );
            }
        } else if ( instance instanceof DisplayObject ) {
            this._childRemoveFromList( instance );
            this._childRemoveFromDisplay( instance );
        }
    }

    _childGroupNameInit( child, parentGroupName ) {
        parentGroupName = child.parent ? child.parent.group : parentGroupName;
        return child.group || parentGroupName || this.defaultGroupStruct.name;
    }

    _childAddToDisplay( child, groupStruct ) {
        groupStruct.instance.add( child.object3D );
        groupStruct.childrenList.push( child );
    }
    _childRemoveFromDisplay( child ) {
        const groupStruct = this._groupStructByChild( child );
        if ( !groupStruct ) return;

        groupStruct.instance.add( child.object3D );
        const index = groupStruct.childrenList.indexOf( child );
        groupStruct.childrenList.splice( index, 1 );

        if ( groupStruct.childrenList.length ) return;

    }
    _childAddToList( child ) {
        this._globalList.push( child );
    }
    _childRemoveFromList( child ) {
        const index = this._globalList.indexOf( child );
        if ( index >= 0 ) this._globalList.splice( index, 1 );
    }

    _sceneListsnersAdd() {
        this._onBeforeChildrenRender = this._onBeforeChildrenRender.bind( this );
        this._scene.onBeforeRender = this._onBeforeChildrenRender;
    }

    _onBeforeChildrenRender( renderer, scene, camera, geometry, material, group ) {
        this.update();
    }


    //
    // GROUPS
    //

    groupIsUniquie( groupName ) {
        const groupStruct = this.groupStructByNameGet( groupName );
        return !!groupStruct;
    }

    groupStructByNameGet( groupName ) {
        for ( let i = 0; i < this._groupStructList.length; i++ ) {
            const groupStruct = this._groupStructList[ i ];
            if ( groupStruct.name === groupName ) {
                return groupStruct;
            }
        }
        return null;
    }

    _initGroups() {
        this._initGroupDefault();
        this._initGroupsFromVO();
    }

    _initGroupDefault() {
        this._groupCreate( "default" );
    }

    _groupCreate( groupName ) {
        const groupStruct = this._groupCreateStruct( groupName );
        this._groupAddToList( groupStruct );
        this._groupAddToScene( groupStruct );
        return groupStruct;
    }

    _groupStructByChild( child ) {
        for ( let i = 0; i < this._groupStructList.length; i++ ) {
            const groupStruct = this._groupStructList[ i ];
            const index = groupStruct.childrenList.indexOf( child );
            if ( index >= 0 ) {
                return groupStruct;
            }
        }
        return null;
    }

    _initGroupsFromVO() {
        if ( !Array.isArray( this.vo.groupNameList ) ) return;
        for ( let i = 0; i < this.vo.groupNameList.length; i++ ) {
            const groupName = this.vo.groupNameList[ i ];
            if ( !this.groupIsUniquie( groupName ) ) continue;
            this._groupCreate( groupName );
        }
    }

    _groupCreateStruct( groupName ) {
        return {
            ... GroupStruct,
            name: groupName,
            instance: new Group()
        };
    }

    _groupAddToList( groupStruct ) {
        this._groupStructList.push( groupStruct );
    }

    _groupRemoveFromList( groupStruct ) {
        const index = this._groupStructList.indexOf( groupStruct );
        if ( index >= 0 ) this._groupStructList.splice( index, 1 );
    }

    _groupAddToScene( groupStruct ) {
        if ( !this._scene ) return;
        this._scene.add( groupStruct.instance );
    }

    _groupRemoveFromScene( groupStruct ) {
        if ( !groupStruct.scene || groupStruct.scene === this._scene ) return;
        groupStruct.scene.remove( groupStruct.instance );
    }

    _groupSceneUpdate() {
        if ( this._scene ) {
            for ( let i = 0; i < this._groupStructList.length; i++ ) {
                const groupStruct = this._groupStructList[ i ];
                if ( groupStruct.scene ) {
                    this._groupRemoveFromScene( groupStruct );
                    this._groupAddToScene( groupStruct );
                }
            }
        } else {
            this._groupRemoveFromScene( groupStruct );
        }
    }


    //
    // DISPLAYOBJECT
    //

    /**
     * Обновить состояния свойств каждого объекта дерева из списка
     * _dirtyList.
     */
    update() {
        super.update();
        if ( !this._dirtyList.length ) return;
        while( this._dirtyList.length ) {
            const child = this._dirtyList.shift();
            if ( child.parent ) child.update();
            if ( child instanceof DisplayObjectContainer ) {
                this._dirtyList = this._dirtyList.concat( child.list );
            }
        }
    }

}