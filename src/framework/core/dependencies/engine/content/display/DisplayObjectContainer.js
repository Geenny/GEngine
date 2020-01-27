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

    get x() { return this._x; }
    set x( value ) {
        super.x = value;
        this.resize();
    }

    get y() { return this._y; }
    set y( value ) {
        super.y = value;
        this.resize();
    }

    get list() { return this._list; }

    get length() { return this._list.length; }

    //
    // INIT
    //

    init() {
        super.init();
        this._initDisplayObjectContainerVars();
    }

    _initDisplayObjectContainerVars() {
        this._list = [];
    }

    _updatePosition() {
        this._parentX = this._parent ? this._parent.x : 0;
        this._parentY = this._parent ? this._parent.y : 0;
        this._realParentX = this._parent ? this._parent._realParentX + this._x : this._x;
        this._realParentY = this._parent ? this._parent._realParentY - this._y : this._y;
    }


    //
    // CHILD
    //

    /**
     * 
     * @param { DisplayObject } child 
     */
    addChild( child ) {
        if ( ! ( child instanceof DisplayObject ) ) return null;
        if ( child.parent ) {
            child.parent.removeChild( child );
        }
        this._addToChildrenList( child );
        child.parent = this;
        child.resize();
        return child;
    }

    removeChild( child ) {
        const index = this._list.indexOf( child );
        if ( index >= 0 ) this._list.splice( index, 1 );
        return child;
    }

    removeChildren() {
        while( this._list.length ) {
            this.removeChild( this._list[ 0 ] );
        }
    }

    _addToChildrenList( child ) {
        this._list.push( child );
    }


    //
    // DISPLAYOBJECT
    //

    resize() {
        this._updatePosition();
        for ( let i = 0; i < this._list.length; i++ ) {
            this._list[ i ].resize();
        }
    }

}