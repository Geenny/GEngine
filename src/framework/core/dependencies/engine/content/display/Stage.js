import DisplayObjectContainer from "./DisplayObjectContainer";
import GroupStruct from "./struct/GroupStruct";
import { Group } from "three";

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
        this._groupSceneUpdate();
    }

    get camera() { return this._camera; }
    set camera( value ) { this._camera = value; }



    //
    // INIT
    //

    init() {
        super.init();
        this._initStageVars();
        this._initGroups();
    }

    _initStageVars() {
        this._scene = this.vo.scene;
        this._camera = this.vo.camera;
        this._width = 0;
        this._height = 0;
        this._stage = this;
        this._globalList = [];
        this._groupStructList = [];
    }
    
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
    addToDisplay( child, groupName = null ) {
        const groupStructDefault = this._groupStructList[ 0 ];
        let groupStruct = !groupName ? groupStructDefault : this.groupStructByNameGet( groupName );
        if ( !groupStruct ) {
            groupStruct = groupStructDefault;
        }

        groupStruct.instance.add( child.object3D );
        groupStruct.childrenList.push( child );
        this._globalList.push( child );
    }
    removeFromDisplay( child ) {
        const index = this._globalList.indexOf( child );
        this._globalList.splice( index, 1 );
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

    _groupAddToScene( groupStruct ) {
        if ( !this._scene ) return;
        this._scene.add( groupStruct.instance );
        groupStruct.scene = this._scene;
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

}