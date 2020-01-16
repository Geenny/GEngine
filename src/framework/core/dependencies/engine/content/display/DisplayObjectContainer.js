import DisplayObject from "./DisplayObject";

export default class DisplayObjectContainer extends DisplayObject {

    /**
     * 
     * @param { SpriteVO } displayVO
     */
    constructor( displayVO ) {
        super( displayVO );
    }

    //
    // GET/SET
    //


    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
    }

    _initVars() {
        this._list = [];
    }


    //
    // CHILD
    //

    /**
     * 
     * @param { DisplayObject } child 
     */
    addChild( child ) {
        if ( child instanceof DisplayObject ) {
            if ( child.parent ) {
                child.parent.removeChild( child );
            }
            this._addToChildrenList( child );
            child.parent = this;
        }
        return null;
    }

    removeChild( child ) {
        const index = this._list.indexOf( child );
        if ( index >= 0 ) {
            this._list.splice( index, 1 );
        }
    }

    removeChildren() {
        while( this._list.length ) {
            this.removeChild( this._list[ 0 ] );
        }
    }

    _addToChildrenList( child ) {
        this._addToChildrenList.push( child );
    }

}