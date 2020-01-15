import SystemAbstract from "../systems/SystemAbstract";
import DeviceEvent from "./DeviceEvent";

export default class DeviceSystem extends SystemAbstract {

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
        this.setListeners();
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
        this.viewUnset();
        super.stop();
    }


    //
    // SET/UNSET
    //

    viewSet() {
        if ( this.isStarted ) return;
        window.addEventListener( "orientationchange", this.onOrientationChange );
    }
    viewUnset() {
        if ( !this.onOrientationChange ) return;
        window.removeEventListener( "orientationchange", this.onOrientationChange );
        this.onOrientationChange = null;
    }


    //
    // LISTENERS
    // 

    setListeners() {
        this.onOrientationChange = ( event ) => {
            this.dispatch( new DeviceEvent( DeviceEvent.ORIENTATION_CHANGE, event.orientation.angle ) );
            screen;
        };
    }

}