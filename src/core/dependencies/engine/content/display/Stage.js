import DisplayObjectContainer from "./DisplayObjectContainer";
import GroupStruct from "./struct/GroupStruct";
import { Group, Line, Geometry, BufferGeometry, LineBasicMaterial, Float32BufferAttribute, Vector3, MeshBasicMaterial, ShapeBufferGeometry, Mesh, Shape } from "three";
import DisplayObject from "./DisplayObject";
import InteractiveManager from "../../interactive/InteractiveManager";
import InteractiveManagerVO from "../../interactive/vo/InteractiveManagerVO";

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

    get application() { return this.engine.application; }

    get engine() { return this.vo.engine; }

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

    get debug() { return false || this._debug; }
    set debug( value ) { this._debug = !!value; }

    /**
     * Количество  элементов на экране
     */
    get length() { return this._globalList.length; }

    get defaultGroupStruct() { return this._groupStructList[ 0 ]; }

    // get interactiveObject3DList() { return this._interactiveObject3DList; }



    //
    // INIT
    //

    init() {
        super.init();
        this._initStageVars();
        this._initGroups();
        this._startInteractiveManager();
    }

    _initStageVars() {
        this._width = 0;
        this._height = 0;
        this._stage = this;
        this._globalList = [];
        this._groupStructList = [];
        this._dirtyList = [];
        // this._interactiveObject3DList = [];
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

    _startInteractiveManager() {
        const interactiveManagerVOData = { stage: this };
        const interactiveManagerVO = new InteractiveManagerVO( interactiveManagerVOData );
        const interactiveManager = new InteractiveManager( interactiveManagerVO );
        interactiveManager.init();

        this.interactiveManager = interactiveManager;
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
        this._childInteractiveAdd( child );
    }

    removeFromDisplay( child ) {
        this._childRemove( child );
        this._childInteractiveRemove( child );
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
                this._childRemove( child );
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
        if ( !groupStruct.childrenList.length ) return;

        groupStruct.instance.add( child.object3D );
        const index = groupStruct.childrenList.indexOf( child );
        groupStruct.childrenList.splice( index, 1 );
    }

    _childInteractiveAdd( child ) {
        this.interactiveManager.add( child );
    }

    _childInteractiveRemove( child ) {
        this.interactiveManager.remove( child );
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
        this._scene.onAfterRender = this._onBeforeChildrenRender;
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

    resize() {
        this.update();
    }

    /**
     * Обновить состояния свойств каждого объекта дерева из списка
     * _dirtyList.
     */
    update() {
        super.update();
        if ( this._dirtyList.length ) {
            while( this._dirtyList.length ) {
                const child = this._dirtyList.shift();
                if ( child.parent ) child.update();
                if ( child instanceof DisplayObjectContainer ) {
                    this._dirtyList = this._dirtyList.concat( child.list );
                }
            }

            if ( this.debug ) {
                this.redrawDebug();
            }
        }

        if ( this.needSort ) {
            this.sort();
        }

        this.interactiveTest();
        
    }

    sort() {
        this.needSort = false;
    }


    //
    // INTERACTIVE
    //

    interactiveTest() {
        this.interactiveManager.intersect();
    }



    //
    // DEBUG
    //

    redrawDebug() {
        if ( !this.line ) {
            let lineGeometry = new BufferGeometry();
            let lineMaterial = new LineBasicMaterial( { color: 0x33CC99, linewidth: 0.5 } );
            this.line = new Line( lineGeometry, lineMaterial );
            this._scene.add( this.line );
        }

        let points = [];
        for ( let i = 0; i < this._globalList.length; i++ ) {
            const child = this._globalList[ i ];
            if ( ( child instanceof Stage ) || ( child instanceof DisplayObjectContainer ) ) continue;
            if ( !child.debugable ) continue;
            const bounds = child.bounds;
            const rectangle = child._rectangle;
            points.push(
                // new Vector3( 0, 0, 0 ),
                // new Vector3( child._parentRealX + bounds.x, child._parentRealY - bounds.y, 0 ),
                // new Vector3( child._parentRealX + bounds.x + bounds.width, child._parentRealY - bounds.y, 0 ),
                // new Vector3( child._parentRealX + bounds.x + bounds.width, child._parentRealY - bounds.y - bounds.height, 0 ),
                // new Vector3( child._parentRealX + bounds.x, child._parentRealY - bounds.y - bounds.height, 0 ),
                // new Vector3( child._parentRealX + bounds.x, child._parentRealY - bounds.y, 0 ),
                // new Vector3( 0, 0, 0 ),
                new Vector3( 0, 0, 0 ),
                new Vector3( child._parentRealX + rectangle.leftTop.x, child._parentRealY - rectangle.leftTop.y, 0 ),
                new Vector3( child._parentRealX + rectangle.rightTop.x, child._parentRealY - rectangle.rightTop.y, 0 ),
                new Vector3( child._parentRealX + rectangle.rightBottom.x, child._parentRealY - rectangle.rightBottom.y, 0 ),
                new Vector3( child._parentRealX + rectangle.leftBottom.x, child._parentRealY - rectangle.leftBottom.y, 0 ),
                new Vector3( child._parentRealX + rectangle.leftTop.x, child._parentRealY - rectangle.leftTop.y, 0 ),
                new Vector3( 0, 0, 0 )
            );
        }

        this.line.geometry.setFromPoints( points );

    }

}