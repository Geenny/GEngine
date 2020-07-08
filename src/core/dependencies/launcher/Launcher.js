import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import DependencyVO from "../../machines/dependency/vo/DependencyVO";
import Log from "../../../utils/log/Log";
import ResourcesEvent from "../engine/modules/modules/resource/event/ResourcesEvent";
import PlatformEvent from "../platform/event/PlatformEvent";

export default class Launcher extends DependencyAbstract {

    /**
     * 
     * @param { LauncherVO } launcherVO Наследник @DependencyVO
     */
    constructor( vo = new DependencyVO() ) {
        super( vo );
    }

    //
    // GET/SET
    //
    get platform() { return this.application.dependencies ? this.application.dependencies.platform : null; }
    get resources() { return this.application.modules ? this.application.modules.resources : null; }
    get stepMachine() { return this.application.stepMachine ? this.application.stepMachine : null; }

    get platformReady() { return this.application.platformReady; }
    set platformReady( value ) { this.application.platformReady = value; }

    get resourceReady() { return this.application.resourceReady; }
    set resourceReady( value ) { this.application.resourceReady = value; }


    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
    }
    _initVars() { }


    //
    // SYSTEMS
    //

    /**
     * 
     */
    startProcess() {
        this._platformSubscribe();
    }

    stopProcess() {
        this._platformUnsubscribe();
        this.stopComplete();
    }


    //
    // PLATFORM
    //

    _platformSubscribe() {
        this.application.addEventListener( PlatformEvent.INIT, this._platformOnInit, this );
        this.application.addEventListener( PlatformEvent.READY, this._platformOnReady, this );
        // this.addEventListener( PlatformEvent.DATA_GET, this._platformOnDataGet, this );
    }
    _platformUnsubscribe() {
        this.application.removeEventListener( PlatformEvent.INIT, this._platformOnInit );
        this.application.removeEventListener( PlatformEvent.READY, this._platformOnReady );
        // this.removeEventListener( PlatformEvent.DATA_GET, this._platformOnDataGet );
    }
    _platformOnInit() {
        this._loadingScreenStart();
        this._initResourcesProgress();
    }
    _platformOnReady() {
        this._platformUnsubscribe();
        this.platformReady = true;
        // this._platformDataGet();
    }
    _platformOnDataGet() {
        // const storageData = this._remoteStorageDataAnalize( event.data );
        // this.storageSetAll( storageData );
        // this.soundSettingsUpdate();
        // this.application.dispatchEvent( new GameEvent( GameEvent.DATA, storageData ) );
        // this.startGameCheck();
        // this.dataReady = true;
    }
    _platformReadySet() {
        if ( !this.platform ) return;
        if ( !this.resourceReady || this.platformReady ) return;
        this.platform.loadReady();
    }
    // _platformDataGet() {
    //     if ( !this.platform || !this.platform.api ) return;
    //     this.platform.api.dataGet();
    // }
    // _remoteStorageDataAnalize( storageData ) {
    //     if ( !storageData[ GAME_DATA_NAME ] ) {
    //         const resultData = { };
    //         resultData[ GAME_DATA_NAME ] = GAME_DATA_DEFAULT;
    //         resultData[ SETTINGS_NAME ] = SETTINGS_DEFAULT;
    //         return merge( { }, resultData );
    //     }
    //     return storageData;
    // }


    

    //
    // RESOURCE PROGRESS
    //
    _initResourcesProgress() {
        if ( !this.resources ) return;
        this.resources.addEventListener( ResourcesEvent.PROGRESS, this._onResourcePreloadProgress, this );
        this.resources.addEventListener( ResourcesEvent.READY, this._onResourcePreloadReady, this );
    }
    _resourceProgressDestroy() {
        if ( !this.resources ) return;
        this.resources.removeEventListener( ResourcesEvent.PROGRESS, this._onResourcePreloadProgress );
        this.resources.removeEventListener( ResourcesEvent.READY, this._onResourcePreloadReady );
    }
    _progressSet( progress ) {
        if ( !this.platform ) return;
        this.platform.api.progressSet( progress );
    }
    _onResourcePreloadProgress( event ) {
        if ( !event.data || event.data.name != "Preload" ) return;
        Log.l( event.data.progress );
        this._progressSet( event.data.progress );
        this.application.dispatchEvent( new ResourcesEvent( ResourcesEvent.PROGRESS, event.target, event.data ) );
    }
    _onResourcePreloadReady( event ) {
        this.resourceReady = true;
        this._resourceProgressDestroy();
        this._platformReadySet();
        this.application.dispatchEvent( new ResourcesEvent( ResourcesEvent.READY, event.target, event.data ) );
        this.startComplete();
    }
    _loadingScreenStart() {
        const step = this.stepMachine.step;
        if ( !step || step.name != "Start" ) return;
        step.stop();
    }
}