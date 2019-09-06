import AbstractDisplay from "./AbstractDisplay";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

export default class ThreeJSDisplay extends AbstractDisplay {

    constructor( displayStruct = {} ) {

        super( displayStruct );

    }


    //
    // GET/SET
    //
    
    get renderer() { return this._renderer; }

    get scene() { return this._scene; }

    get camera() { return this._camera; }
    set camera( value ) {
        this._camera = value;
    }

    get size() { return this._size; }
    set size( value ) {
        if ( value &&
             ( value.x != this._size.x ||
               value.y != this._size.y ) )
        {
            this._size.x = value.x;
            this._size.y = value.y;
        }
    }

    
    //
    // INIT
    //

    initVars() {
        this._renderer = new WebGLRenderer();
        this._scene = new Scene( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this._camera = new PerspectiveCamera();
    }



}