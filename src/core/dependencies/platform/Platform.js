import PlatformEvent from "./event/PlatformEvent";
import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import PlatformVO from "./vo/PlatformVO";
import FacebookPlatform from "./platforms/PlatformFacebook";
import None from "./platforms/PlatformNone";
import PlatformName from "./constants/PlatformName";

export default class Platform extends DependencyAbstract {

    constructor( platformVO = new PlatformVO() ) {
        super( platformVO );
    }


    //
    // GET/SET
    //
    get progress() { return this.api ? this.api.progress : 0; }

    get platformName() { return this.vo.platformName; }
    get platformVersion() { return this.vo.platformVersion; }
    get platformLocale() { return this.vo.platformLocale; }

    get playerID() { return this.vo.playerID; }
    get playerName() { return this.vo.playerName; }
    get playerNick() { return this.vo.playerNick; }
    get playerAvatar() { return this.vo.playerAvatar; }
    get playerEmail() { return this.vo.playerEmail; }
    get playerPhone() { return this.vo.playerEmail; }
    


    //
    // INIT
    //
    init() {
        super.init();
        this._initVars();
        this.platformInit();
    }
    _initVars() { }


    //
    // SUBSCRIBE
    //
    subscribe() {
        this.api.addEventListener( PlatformEvent.INIT, this.onPlatformInit, this );
        this.api.addEventListener( PlatformEvent.START, this.onPlatformStart, this );
        this.api.addEventListener( PlatformEvent.READY, this.onPlatformReady, this );
        this.api.addEventListener( PlatformEvent.FRIENDS, this.onPlatformFriends, this );
        this.api.addEventListener( PlatformEvent.DATA_GET, this.onPlatformDataGet, this );
        this.api.addEventListener( PlatformEvent.DATA_SET, this.onPlatformDataSet, this );
        this.api.addEventListener( PlatformEvent.ERROR, this.onPlatformError, this );
    }
    unsubscribe() {
        this.api.removeEventListener( PlatformEvent.INIT, this.onPlatformInit, this );
        this.api.removeEventListener( PlatformEvent.START, this.onPlatformStart, this );
        this.api.removeEventListener( PlatformEvent.READY, this.onPlatformReady, this );
        this.api.removeEventListener( PlatformEvent.FRIENDS, this.onPlatformFriends, this );
        this.api.removeEventListener( PlatformEvent.DATA_GET, this.onPlatformDataGet, this );
        this.api.removeEventListener( PlatformEvent.DATA_SET, this.onPlatformDataSet, this );
        this.api.removeEventListener( PlatformEvent.ERROR, this.onPlatformError, this );
    }


    //
    // DEPENDENCY
    //
    /**
     * 
     */
    startProcess() {
        this.subscribe();
        this.api.start();
    }

    stopProcess() {
        this.api.stop();
        this.unsubscribe();
        this.stopComplete();
    }



    //
    // API
    //
    
    platformInit() {
        const ApiClass = this.apiClassAutoGet();
        this.api = new ApiClass( this, this.vo.platformVOData );
        this.api.init();
    }
    onPlatformInit( event ) {
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.INIT, this, event.data ) );
    }
    onPlatformStart( event ) {
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.START, this, event.data ) );
    }
    onPlatformDataGet( event ) {
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.DATA_GET, this, event.data ) );
    }
    onPlatformDataSet( event ) {
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.DATA_SET, this, event.data ) );
    }
    onPlatformFriends( event ) {
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.FRIENDS, this, event.data ) );
    }
    onPlatformReady( event ) {
        this.startComplete();
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.READY, this, event.data ) );
    }
    onPlatformError( event ) {
        this.application.dispatchEvent( new PlatformEvent( PlatformEvent.ERROR, this, event.data ) );
    }

    loadReady() {
        this.api.apiStart();
    }
    
    apiClassAutoGet() {
        if ( this.platformName === PlatformName.FB ) return FacebookPlatform;
        return None;
    }

}