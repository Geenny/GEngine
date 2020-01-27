import EventDispatcherVOWrapper from "../../../../../data/vo/EventDispatcherVOWrapper";
import { MeshBasicMaterial } from "three";

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
        this._updateStage();
        this._updatePosition();
    }

    get name() { return this._name; }

    get object3D() { return this._object3D; } // Mesh, Sprite
    get geometry() { return this._geometry; }
    get material() { return this._material; }

    get texture() { return this._texture; }
    set texture( value ) {
        if ( value === this._texture )return;
        this._texture = value;
        this.materialUpdate();
        this.displayObjectUpdate();
    }

    get x() { return this._x; }
    set x( value ) {
        this._x = value;
        if ( !this._object3D ) return;
        this._updatePosition();
        this._object3D.position.x = this._rx;
    }

    get y() { return this._y; }
    set y( value ) {
        this._y = value;
        if ( !this._object3D ) return;
        this._updatePosition();
        this._object3D.position.y = this._ry;
    }

    get width() { return this._width; }
    set width( value ) { this._width = value; }

    get height() { return this._height; }
    set height( value ) { this._height = value; }
    
    get rotation() { return this._rotation; }
    set rotation( value ) {
        this._rotation = value;
        if ( !this._object3D ) return;
        this._object3D.rotation.z = value;
    }

    //
    // INIT
    //

    init() {
        if ( this._inited ) return;
        this._inited = true;
        this._initDisplayObjctVars();
    }

    _initDisplayObjctVars() {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
        this._rotation = 0;
        this._parentX = 0;
        this._parentY = 0;
        this._realParentX = 0;
        this._realParentY = 0;
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

    _updatePosition() {
        if ( this._parent ) {
            this._parentX = this._parent.x;
            this._parentY = this._parent.y;
            this._realParentX = this._parent._realParentX;
            this._realParentY = this._parent._realParentY;
        } else {
            this._parentX = 0;
            this._parentY = 0;
            this._realParentX = 0;
            this._realParentY = 0;
        }
        // this.x = this._x;
        // this.y = this._y;
        this._rx = this._realParentX + this._x + this._width * 0.5;
        this._ry = this._realParentY - this._y - this._height * 0.5;
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

    materialGet() {
        const materialParameters = this.materialParametersGet();
        const material = new MeshBasicMaterial( materialParameters );
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

    materialUpdate()  {
        if ( this._material.map === this.texture ) return;
        this._material.map = this.texture;
        this._material.needsUpdate = true;
    }


    //
    // DISPLAYOBJECT
    //

    displayObjectUpdate() { }


    //
    // RESIZE
    //

    resize() {
        this._updatePosition();
        this.x = this._x;
        this.y = this._y;
    }

}