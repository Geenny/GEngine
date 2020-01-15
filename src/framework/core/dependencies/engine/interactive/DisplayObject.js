import InteractiveObject from "./InteractiveObject";

export default class DisplayObject extends InteractiveObject {

    /**
     * 
     * @param { SpriteVO } spriteVO
     */
    constructor( displayVO ) {
        super( displayVO );
    }

    //
    // GET/SET
    //

    get width() { return this._width; }
    get height() { return this._height; }

    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._initVars();
        this._draw();
    }

    _initVars() {
        this._width = 0;
        this._height = 0;
    }

    _draw() {

    }

}