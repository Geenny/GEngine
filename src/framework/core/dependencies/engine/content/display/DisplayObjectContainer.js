import DisplayObject from "./DisplayObject";
import PlaneObject from "./PlaneObject";
import SpriteVO from "./vo/SpriteVO";
import PlaneObjectVO from "./vo/PlaneObjectVO";

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

    // get x() { return this._x; }
    // set x( value ) {
    //     if (isNaN(value)) debugger;
    //     if (value === undefined) debugger;
    //     super.x = value;
    // }

    // get y() { return this._y; }
    // set y( value ) {
    //     if (isNaN(value)) debugger;
    //     if (value === undefined) debugger;
    //     super.y = value;
    // }

    // get rotation() { return this._rotation; }
    // set rotation( value ) {
    //     if (isNaN(value)) debugger;
    //     if (value === undefined) debugger;
    //     super.rotation = value;
    // }

    get list() { return this._list; }

    get length() { return this._list.length; }

    //
    // INIT
    //

    init() {
        super.init();
        this._initDisplayObjectContainerVars();
        this._initCenterPlane();
    }

    _initDisplayObjectContainerVars() {
        this._list = [];
    }

    _initCenterPlane() {
        const planeVOData = { materialData: { color: 0xff0000 }, width: 10, height: 10 };
        const planeVO = new PlaneObjectVO( planeVOData );
        const plane = new PlaneObject( planeVO );
        this.addChild( plane );
    }

    _updateProperties() {
        this.dirty = false;
        
        this._parentX = this._parent ? this._parent.x : 0;
        this._parentY = this._parent ? this._parent.y : 0;
        this._parentRealRotation = this._parent ? this._parent._realRotation : 0;
        this._realRotation = this._parentRealRotation + this._rotation;
        this._rсX = this._x * Math.cos( this._parentRealRotation ) - this._y * Math.sin( this._parentRealRotation );
        this._rсY = this._x * Math.sin( this._parentRealRotation ) + this._y * Math.cos( this._parentRealRotation );
        this._rx = this._parent ? this._parent._rx + this._rсX : this._x;
        this._ry = this._parent ? this._parent._ry - this._rсY : this._y;
    }

    _updatePosition() { }


    //
    // CHILD
    //

    /**
     * 
     * @param { DisplayObject } child 
     */
    addChild( child ) {
        if ( ! ( child instanceof DisplayObject ) ) return null;
        if ( child ===  this ) return null;
        if ( child.parent ) {
            child.parent.removeChild( child );
        }
        this._addToChildrenList( child );
        this.dirtyChildSet( child );
        child.parent = this;
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

    dirtyChildSet( child ) {
        if ( !this._parent ) return;
        this._parent.dirtyChildSet( child );
    }

    _addToChildrenList( child ) {
        this._list.push( child );
    }


    //
    // DISPLAYOBJECT
    //

    update() {
        this._updatePosition();
        this._updateProperties();
        this.dirty = false;
    }

}