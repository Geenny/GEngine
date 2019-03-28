import SystemAbstract from "../systems/SystemAbstract";
import KeyboardEvent from "./KeyboardEvent";

export default class KeyboardSystem extends SystemAbstract {

    constructor( vo ) {
        super( vo );
        this.init();
    }


    //
    // GET/SET
    //
    get application() { return this.target; }
    get applicationView() { return this.application.applicationView; }
    get htmlElement() { return this.applicationView.htmlElement; }



    //
    // INIT
    //

    init() {
        // 
    }
    initVO( vo ) {
        this.vo = vo;
    }


    //
    //
    //

    start() {
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