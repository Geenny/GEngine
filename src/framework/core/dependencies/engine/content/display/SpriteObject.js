import DisplayObject from "./DisplayObject";
import { Sprite, SpriteMaterial } from "three";

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

    get ready() { return this._ready; }

    // get geometry() { return this._geomerty; }
    // set geometry( value ) { this._geomerty = value; }

    // get mesh() { return this._mesh; }
    // set mesh( value ) { this._mesh = value; }

    get texture() { return this._texture; }
    get material() { return this._material; }
    get sprite() { return this._sprite; }


    //
    // INIT
    //

    init() {
        super.init();
        this._initSpriteObjectVars();
        this.redraw();
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

    _draw() {
        this._material = this.materialGet();
        const sprite = new Sprite( this.material );
        this._object3D = sprite;
    }


    //
    // MATERIAL
    // 

    materialGet() {
        const materialParameters = this.materialParametersGet();
        const material = new SpriteMaterial( materialParameters );
        return material;
    }
    materialParametersGet() {
        const materialParameters = {
            map: this.texture,
            color: this.vo.color,
            fog: this.vo.fog
        };
        return materialParameters;
    }

}