import SystemAbstract from "../systems/SystemAbstract";
import ResizeEvent from "./ResizeEvent";

export default class DisplaySystem extends SystemAbstract {

    constructor( vo ) {
        super( vo );
        this.init();
    }


    //
    // GET/SET
    //
    get widthPage() { return this._widthPage || 0; }
    get heightPage() { return this._heightPage || 0; }
    get width() { return this._width || 0; }
    get height() { return this._height || 0; }
    get application() { return this.target; }
    get applicationView() { return this.application.applicationView; }
    get htmlElement() { return this.applicationView.htmlElement; }



    //
    // INIT
    //

    init() {
        this.sizeUpdate();
    }
    initVO( vo ) {
        this.vo = vo;
    }

    sizeUpdate( width = undefined, height = undefined ) {
        this._width = width != undefined || !this.htmlElement ? width : this.htmlElement.offsetWidth;
        this._height = height != undefined || !this.htmlElement ? height : this.htmlElement.offsetHeight;
        this._widthPage = window.innerWidth;
        this._heightPage = window.innerHeight;
    }


    //
    //
    //

    start() {
        this.viewSet();
        super.start();
    }

    stop() {
        window.onresize = null;
        super.stop();
    }


    //
    //
    //

    viewSet() {
        if ( this.isStarted ) return;
        this._viewResizeSet();
    }

    _viewResizeSet() {
        this.dispatch( new ResizeEvent( ResizeEvent.SET, this.width, this.height, this.widthPage, this.heightPage ) );
        window.addEventListener( "resize", ( event ) => {
            this.sizeUpdate();
            this.dispatch( new ResizeEvent( ResizeEvent.RESIZE, this.width, this.height, this.widthPage, this.heightPage ) );
        });
    }

}