import SystemAbstract from "../systems/SystemAbstract";
import ResizeEvent from "./ResizeEvent";
import VisibilityEvent from "./VisibilityEvent";

export default class DisplaySystem extends SystemAbstract {

    constructor( vo ) {
        super( vo );
        this.init();
    }


    //
    // GET/SET
    //

    get size() { return this._size; }
    get widthPage() { return this._widthPage || 0; }
    get heightPage() { return this._heightPage || 0; }
    get width() { return this._width || 0; }
    get height() { return this._height || 0; }
    get application() { return this.target; }
    get htmlElement() { return this.application.htmlElement; }



    //
    // INIT
    //

    init() {
        this.sizeUpdate();
        this.setListeners();
    }
    initVO( vo ) {
        this.vo = vo;
    }

    sizeUpdate( width = undefined, height = undefined ) {
        this._width = width != undefined || !this.htmlElement ? width : this.htmlElement.offsetWidth;
        this._height = height != undefined || !this.htmlElement ? height : this.htmlElement.offsetHeight;
        this._widthPage = window.innerWidth;
        this._heightPage = window.innerHeight;
        this._size = { x: this._width, y: this._height };
    }


    //
    //
    //

    start() {
        this.viewSet();
        this.onResize();
        super.start();
    }

    stop() {
        this.viewUnset();
        super.stop();
    }


    //
    // SET/UNSET
    //

    viewSet() {
        if ( this.isStarted ) return;
        window.addEventListener( "resize", this.onResize );
        document.addEventListener( "visibilitychange", this.onVisibilityChange );
    }
    viewUnset() {
        if ( !this.onResize || !this.onVisibilityChange ) return;
        window.removeEventListener( "resize", this.onResize );
        document.removeEventListener( "visibilitychange", this.onVisibilityChange );
        this.onResize = null;
        this.onVisibilityChange = null;
    }


    //
    // LISTENERS
    // 

    setListeners() {
        this.onResize = ( event ) => {
            this.sizeUpdate();
            this.dispatch( new ResizeEvent( ResizeEvent.RESIZE, this.width, this.height, this.widthPage, this.heightPage ) );
        };
        this.onVisibilityChange = ( event ) => {
            this.dispatch( new VisibilityEvent( VisibilityEvent.CHANGE, document.visibilityState ) );
        };
    }

}