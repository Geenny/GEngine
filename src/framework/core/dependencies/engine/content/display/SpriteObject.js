import DisplayObject from "./DisplayObject";
import { Sprite, SpriteMaterial, TextureLoader } from "three";
import ResourceGenerator from "../../resource/ResourceGenerator";
import Resources from "../../resource/Resources";
import ResourceStruct from "../../resource/struct/ResourceStruct";
import ResourceType from "../../resource/enum/ResourceType";

export default class SpriteObject extends DisplayObject {

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

    get sprite() { return this._object3D; }

    set width( value ) {
        this._width = value;
        this.sprite.scale.x = this.width;
    }
    
    set height( value ) {
        this._height = value;
        this.sprite.scale.y = this.height;
    }


    //
    // INIT
    //

    init() {
        super.init();
        this._initSpriteObjectVars();
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

    _initSpriteObjectVars() {
        this._texture = this.vo.texture;
    }


    //
    // DRAW
    //

    redraw() {
        if ( this.ready ) {
            this._ready = false;
            this.clear();
        }
        this._draw();
    }

    clear() {

    }

    displayObjectUpdate() {
        if ( !this.material.map ) return;
        this.width = this.material.map.image.width;
        this.height = this.material.map.image.height;
    }

    _draw() {
        this._material = this.materialCreate();
        const sprite = new Sprite( this.material );
        this._object3D = sprite;
    }


    //
    // MATERIAL
    // 

    materialUpdate()  {
        if ( this._material.map === this.texture ) return;
        this._material.map = this.texture;
        this._material.needsUpdate = true;
    }

}