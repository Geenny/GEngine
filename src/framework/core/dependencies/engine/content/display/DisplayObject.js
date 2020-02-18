import EventDispatcherVOWrapper from "../../../../../data/vo/EventDispatcherVOWrapper";
import { MeshBasicMaterial } from "three";
import Rectangle from "../../../../../data/content/graphics/Rectangle";

export default class DisplayObject extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { DisplayObjectVO } displayObjectVO
     */
    constructor( displayObjectVO ) {
        super( displayObjectVO );
        this.init();
    }

    //
    // GET/SET
    //

    get enable() { return this._enable; }
    set enable( value ) { this._enable = value; }

    get ready() { return this._ready; }

    get group() { return this.vo.group; }
    set group( value ) { this.vo.group = value; }

    get stage() { return this._stage; }

    get parent() { return this._parent; }
    set parent( value ) {
        this._parent = value;
        this.dirty = true;
        this._updateStage();
    }

    get name() { return this._name; }
    set name( value ) { this._name = value; }

    get object3D() { return this._object3D; } // Mesh, Sprite
    get geometry() { return this._geometry; }
    get material() { return this._material; }

    get texture() { return this._texture; }
    set texture( value ) {
        if ( value === this._texture )return;
        this._texture = value;
        this.displayObjectUpdate();
        this.materialUpdate();
    }

    get dirty() { return this._dirty; }
    set dirty( value ) {
        if ( typeof value != 'boolean' ) debugger;
        if ( !this._dirty && value ) {
            if ( this._parent ) {
                this._parent.dirtyChildSet( this );
            }
        }
        this._dirty = value;
    }

    get x() { return this._x; }
    set x( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._x = value;
    }

    get y() { return this._y; }
    set y( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._y = value;
    }

    get width() { return this._width * this._scalex; }
    set width( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._width = value / this._scalex;
    }

    get height() { return this._height * this._scaley; }
    set height( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._height = value / this._scaley;
    }
    
    get rotation() { return this._rotation; }
    set rotation( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._rotation = value % Math.PI2;
    }

    get scaleX() { return this._scalex; }
    set scaleX( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._scalex = value;
    } 

    get scaleY() { return this._scaley; }
    set scaleY( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._scaley = value;
    }

    get visible() { return this._visible; }
    set visible( value ) {
        if ( typeof value != 'boolean' ) debugger;
        this.dirty = true;
        this._scaley = value;
    }

    get alpha() { return this._alpha; }
    set alpha( value ) {
        if (isNaN(value)) debugger;
        if (value === undefined) debugger;
        this.dirty = true;
        this._alpha = value;
    }

    get depth() { return this._depth; }

    get bounds() { return this._bounds; }

    get debug() { return this._stage && this._stage.debug; }
    get debugable() { return this.vo.debugable; }

    //
    // INIT
    //

    init() {
        if ( this._inited ) return;
        this._inited = true;
        this._initDisplayObjctVars();
    }

    _initDisplayObjctVars() {
        this._dirty = true;
        this._visible = true;
        this._alpha = 1;
        this._x = 0;
        this._y = 0;
        this._scalex = 1;
        this._scaley = 1;
        this._width = 0;
        this._height = 0;
        this._rotation = 0;
        this._rectangle = new Rectangle();
        this._bounds = new Rectangle();
        this._parentX = 0;
        this._parentY = 0;
        this._parentRealX = 0;
        this._parentRealY = 0;
        this._realRotation = 0;
        this._rx = 0;
        this._ry = 0;
        this._rr = 0;
        this._enable = this.vo.enable;
        this._name = this.vo.name;
        this._texture = this.vo.texture;
    }

    _updateStage() {
        if ( this._parent && this._parent.stage && !this._stage ) {
            this._stage = this._parent.stage;
            this._stage.addToDisplay( this );
        } else {
            if ( this._stage ) {
                this._stage.removeFromDisplay( this );
            }
            this._stage = null;
        }
    }

    _updateProperties() {
        this._dirty = false;

        if ( this._parent ) {
            this._parentX = this._parent.x;
            this._parentY = this._parent.y;
            this._parentRealX = this._parent._rx;
            this._parentRealY = this._parent._ry;
            this._parentRealRotation = this._parent._realRotation;
        } else {
            this._parentX = 0;
            this._parentY = 0;
            this._parentRealX = 0;
            this._parentRealY = 0;
            this._parentRealRotation = 0;
        }

        this._realRotation = this._parentRealRotation + this._rotation;

        this._rectangle.update( this._x, this._y, this._width * this._scalex, this._height * this._scaley );
        this._rectangle.angle = this._parentRealRotation;
        this._bounds.update(
            this._rectangle.left,
            this._rectangle.top,
            this._rectangle.right - this._rectangle.left,
            this._rectangle.bottom - this._rectangle.top );

        this._rpX = this._width * this._scalex * 0.5 + this._x;
        this._rpY = this._height * this._scaley * 0.5 + this._y;
        this._rx = this._rpX * Math.cos( this._parentRealRotation ) - this._rpY * Math.sin( this._parentRealRotation );
        this._ry = this._rpX * Math.sin( this._parentRealRotation ) + this._rpY * Math.cos( this._parentRealRotation );
        this._rr = this._realRotation;
    }

    _updatePosition() {
        if ( !this._object3D ) return;
        this._material.opacity = this._alpha;
        this._object3D.visible = this._visible;
        this._object3D.position.x = this._parentRealX + this._rx;
        this._object3D.position.y = this._parentRealY - this._ry;
        this._object3D.rotation.z = -this._rr;
        this._object3D.scale.x = this._width / this.geometry.parameters.width;
        this._object3D.scale.y = this._height / this.geometry.parameters.height;
    }


    //
    // TEXTURE
    //

    textureSet( texture ) {
        this.texture = texture;
    }

    
    //
    // MATERIAL
    // 

    materialCreate() {
        const materialParameters = this.materialParametersGet();
        const material = new MeshBasicMaterial( materialParameters );

        if ( this._texture ) {
            material.map = this._texture;
        }

        return material;
    }
    
    materialParametersGet() {
        const materialParameters = { };
        if ( this.vo.materialData ) {
            for ( const key in this.vo.materialData ) {
                materialParameters[ key ] = this.vo.materialData[ key ];
            }
        }
        return materialParameters;
    }

    materialUpdate() {
        if ( !this._object3D ) return;
        if ( this._material.map === this.texture ) return;
        this._material.map = this.texture;
        this._material.needsUpdate = true;
    }

    
    //
    // GEOMETRY
    //

    geometryCreate() {
        return new PlaneBufferGeometry( this._width, this._height, 1, 1 );
    }



    //
    // DISPLAYOBJECT
    //

    displayObjectUpdate() { }


    //
    // RESIZE
    //

    update() {
        this._updateProperties();
        this._updatePosition();
    }

}