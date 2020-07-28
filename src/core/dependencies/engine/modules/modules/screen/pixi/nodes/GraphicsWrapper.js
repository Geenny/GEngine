import { Graphics } from "pixi.js";
import Resources from "../../../resource/Resources";
import ResourceEvent from "../../../resource/event/ResourceEvent";
import Point from "../../../../../../../../data/content/graphics/Point";

export default class GraphicsWrapper extends Graphics {


    //
    // GET/SET
    //
    get parameters() { return this._parameters; }
    set parameters( value ) {
        this._parameters = value || {};
        this.redraw();
    }

    get size() { return this._size || new Point( 100, 100 ); }
    set size( point ) {
        if ( point === this._size ) return;
        if ( !( point instanceof Point ) ) return;
        this._size = point;
    }


    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
        this.redraw();
    }


    //
    // DRAW
    //
    redraw() {
        this.clear();
        this.draw();
    }
    draw() {
        if ( !this._parameters ) return;
        if ( this._parameters.fillIs ) {
            this.beginFill( this._parameters.fillColor || 0, this._parameters.fillAlpha || 1 );
        }
        if ( this._parameters.lineOptions ) {
            this.lineStyle( this._parameters.lineOptions || { } );
        }
        if ( this._parameters.drawRect ) {
            this.drawRect( 0, 0, this.size.x, this.size.y );
        }
        if ( this._parameters.drawCircle ) {
            this.drawCircle( 0, 0, this.size.x );
        }
    }

}