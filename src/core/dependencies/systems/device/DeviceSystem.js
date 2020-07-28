import SystemAbstract from "../systems/SystemAbstract";
import DeviceEvent from "./DeviceEvent";
import DeviceOrientationType from "./DeviceOrientationType";
import MobileDetect from "mobile-detect";

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

    get orientation() { return screen && screen.orientation ? screen.orientation : { orientation: { } }; }
    get orientationType() { return this.orientation.type || DeviceOrientationType.LANDSCAPE; }

    get isMobile() { return this._ismobile; }


    //
    // INIT
    //

    init() {
        this.setListeners();
        this.setDeviceType();
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
            if ( !screen || !screen.orientation ) return;
            this.dispatch( new DeviceEvent( DeviceEvent.ORIENTATION_CHANGE, this, screen.orientation ) );
        };
    }

    setDeviceType() {
        this.updateMobileUpdate();
        this.application.isMobile = this.isMobile;
    }
    updateMobileUpdate() {
        const mobileDetect = new MobileDetect( window.navigator.userAgent );
        this._ismobile = !!mobileDetect.mobile() || !!mobileDetect.phone();
    }

}