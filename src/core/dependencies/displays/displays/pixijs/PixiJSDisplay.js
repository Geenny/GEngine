import AbstractDisplay from "../AbstractDisplay";
import { Application } from "pixi.js";

export default class PixiJSDisplay extends AbstractDisplay {

    constructor( displayVO ) {

        super( displayVO );

    }


    //
    // GET/SET
    //

    get pixi() { return this._pixi; }

    
    //
    // INIT
    //

    initVars() {

        this._enable = true;

        this.initScene();
        this.initViewElement();
    }
    initScene() {
        const pixiOptions = { ...this.vo.pixiOptions };
        this._pixi = new Application( pixiOptions );
        this.resize( this.size.x, this.size.y );
    }
    initViewElement() {
        this.vo.canvas = this._pixi.view;
        this.viewElement = this._pixi.view;
    }


    //
    // RESIZE
    //
    resize( width, height ) {
        super.resize( width, height );
        this._pixi.renderer.autoResize = true;
        // this._pixi.renderer.resize( width - 4, height - 4);
        this._pixi.renderer.resize( width, height );
    }


    //
    // DRAW
    //

    draw() {
        if ( !this.enable ) return;

        // this.dispatchEvent( new DisplayEvent( DisplayEvent.BEFORE_RENDER ), false );
        // this.dispatchEvent( new DisplayEvent( DisplayEvent.AFTER_RENDER ), false );
    }
}