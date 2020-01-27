import DisplayObject from "./DisplayObject";
import { Mesh, Sprite, SpriteMaterial, TextureLoader, PlaneGeometry, MeshPhongMaterial, PlaneBufferGeometry, DoubleSide, Texture } from "three";
import ResourceGenerator from "../../resource/ResourceGenerator";
import Resources from "../../resource/Resources";
import ResourceStruct from "../../resource/struct/ResourceStruct";
import ResourceType from "../../resource/enum/ResourceType";

export default class PlaneObject extends DisplayObject {

    /**
     * 
     * @param { SpriteVO } spriteVO
     */
    constructor( spriteVO ) {
        super( spriteVO );
    }

    //
    // GET/SET
    //

    // set x( value ) {

    // }
    set width( value )  {
        this.geometry.scale.x = value / this.geometry.parameters.width;
    }
    set height( value )  {
        this.geometry.scale.y = value / this.geometry.parameters.height;
    }


    //
    // INIT
    //

    init() {
        super.init();
        this._initPlaneObjectVars();
        this._initTexture();
        this.redraw();
    }

    _initTexture() {
        if ( this.texture ) return;

        const resourceStruct = { ...ResourceStruct };
        resourceStruct.textureName = this.vo.textureName;
        resourceStruct.type = ResourceType.TEXTURE;
        resourceStruct.onComplete = this.textureSet.bind( this );

        Resources.resourceGet( resourceStruct );
    }

    _initPlaneObjectVars() {
        this._width = this.vo.width || 256;
        this._height = this.vo.height || 256;
    }


    //
    // DRAW
    //

    redraw() {
        this.clear();
        this._draw();
    }

    clear() { }

    displayObjectUpdate() {
        if ( !this.material.map ) return;
        this.width = this.material.map.image.width;
        this.height = this.material.map.image.height;
    }

    _draw() {
        this._material = this.materialGet();
        this._geometry = new PlaneBufferGeometry( this._width, this._height, 8, 8 );
        const mesh = new Mesh( this._geometry, this.material );
        this._object3D = mesh;
    }


    //
    // MATERIAL
    // 

    materialUpdate()  {
        if ( this._material.map === this.texture ) return
        this._material.map = this.texture;
        this._material.needsUpdate = true;
    }

}