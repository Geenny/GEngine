import ApplicationEvent from "./event/ApplicationEvent";
import ApplicationVO from "./vo/ApplicationVO";
import Log from "../../utils/log/Log";
import DependencyMachine from "../machines/dependency/DependencyMachine";
import DependencyMachineVO from "../machines/dependency/vo/DependencyMachineVO";
import Event from "../machines/event/Event";
import DependencyMachineEvent from "../machines/dependency/events/DependencyMachineEvent";
import TickerMachine from "../machines/ticker/TickerMachine";
import TickerMachineVO from "../machines/ticker/vo/TickerMachineVO";
import EventDispatcherVOWrapper from "../../data/vo/EventDispatcherVOWrapper";
import StepMachineVO from "../machines/step/vo/StepMachineVO";
import StepMachine from "../machines/step/StepMachine";
import StepEvent from "../machines/step/events/StepEvent";
import PlatformEvent from "../dependencies/platform/event/PlatformEvent";
import ResourcesEvent from "../dependencies/engine/modules/modules/resource/event/ResourcesEvent";

export default class Application extends EventDispatcherVOWrapper {

    /**
     * 
     * @param {ApplicationVO} vo 
     */
    constructor( vo = new ApplicationVO() ) {

        super( vo );

        this.setHTMLElement( vo.HTMLElement );

        Log.l( "Application Started!!!", true );

    }


    //
    // GET/SET
    //

    /**
     * Main HTMLElement
     */
    get HTMLElement() { return this.vo.HTMLElement; }

    /**
     * Device Pixel Ratio
     */
    get dpr() { return window.devicePixelRatio || 1; }

    /**
     * Get current step from step machine
     */
    get step() { return this.stepMachine ? this.stepMachine.step : null; }

    
    //
    // INIT
    //

    init() {
        this._initVars();
        this.initTickerMachine();
        this.initStepMachine();
        this.initDependencyMachine();
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.INIT ) );

        this.platformSubscribe();
    }

    _initVars() {
        this.applicationDisplay = null;
        Math.PI2 = Math.PI * 2;
    }


    //
    // DESTROY
    //

    destroy() {
        this.stepMachine.destroy();
        this.dependencyMachine.destroy();
        this.tickerMachine.destroy();
        this.platformUnsubscribe();
    }


    //
    // DEPENDENCY
    //

    initDependencyMachine() {
        const dependencyMachineVO = this.dependencyMachineVOGet();
        const dependencyMachine = new DependencyMachine( dependencyMachineVO );
        dependencyMachine.addEventListener( Event.ANY, this.onDependencyMachineEvent, this );
        dependencyMachine.init();

        this.dependencyMachine = dependencyMachine;
    }
    onDependencyMachineEvent( event ) {
        const dependency = event.dependency;
        if ( dependency.name && !this[ dependency.name ] ) {
            this[ dependency.name ] = dependency;
        }
        this.dispatchEvent( new DependencyMachineEvent( event.type, event.dependencyMachine, event.dependency ) );
    }

    dependencyMachineVOGet( data = {} ) {
        let dependencyMachineVO = null;

        if ( this.vo.dependencyMachineVO instanceof DependencyMachineVO ) {
            dependencyMachineVO = this.vo.dependencyMachineVO;
        } else if ( this.vo.dependencyMachineVO ) {
            dependencyMachineVO = new DependencyMachineVO( this.vo.dependencyMachineVO );
        } else {
            dependencyMachineVO = new DependencyMachineVO( data );
        }

        dependencyMachineVO.application = this;

        return dependencyMachineVO;
    }


    //
    // TICKER MACHINE
    //
    
    initTickerMachine() {
        const tickerMachine = new TickerMachine( this.vo.tickerMachineVO || new TickerMachineVO() );
        this.tickerMachine = tickerMachine;
    }

    
    //
    // STEP_MACHINE
    //

    initStepMachine() {
        const stepMachineData = this.vo.stepMachineVO || { steps: [] };
        stepMachineData.application = this;

        const stepMachineVO = new StepMachineVO( stepMachineData );
        const stepMachine = new StepMachine( stepMachineVO );
        stepMachine.init();
        stepMachine.addEventListener( StepEvent.ANY, this.onStepMachineHandle, this );

        this.stepMachine = stepMachine;
    }
    onStepMachineHandle( event ) { }


    //
    // PLATFORM
    //

    platformSubscribe() {
        this.addEventListener( PlatformEvent.INIT, this._platformOnInit, this );
        this.addEventListener( PlatformEvent.READY, this._platformOnReady, this );
        this.addEventListener( PlatformEvent.DATA_GET, this._platformOnDataGet, this );
    }
    platformUnsubscribe() {
        this.removeEventListener( PlatformEvent.INIT, this._platformOnInit );
        this.removeEventListener( PlatformEvent.READY, this._platformOnReady );
        this.removeEventListener( PlatformEvent.DATA_GET, this._platformOnDataGet );
    }
    _platformOnInit() {
        this.loadingScreenStart();
        this.initResourcesProgress();
    }
    _platformOnReady() {
        this._platformDataGet();
        this.platformReady = true;
    }
    _platformOnDataGet() {
        // debugger;
        // const storageData = this._remoteStorageDataAnalize( event.data );
        // this.storageSetAll( storageData );
        // this.soundSettingsUpdate();
        // this.dispatchEvent( new GameEvent( GameEvent.DATA, storageData ) );
        // this.startGameCheck();
        // this.dataReady = true;
    }
    _platformReadySet() {
        if ( !this.resourceReady || this.platformReady ) return;
        this.Platform.loadReady();
    }
    _platformDataGet() {
        if ( !this.Platform || !this.Platform.api ) return;
        this.Platform.api.dataGet();
    }
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
    initResourcesProgress() {
        if ( !this.resources ) return;
        this.resources.addEventListener( ResourcesEvent.PROGRESS, this.onResourcePreloadProgress, this );
        this.resources.addEventListener( ResourcesEvent.READY, this.onResourcePreloadReady, this );
    }
    destroyResourceProgress() {
        if ( !this.resources ) return;
        this.resources.removeEventListener( ResourcesEvent.PROGRESS, this.onResourcePreloadProgress );
        this.resources.removeEventListener( ResourcesEvent.READY, this.onResourcePreloadReady );
    }
    progressSet( progress ) {
        if ( !this.Platform ) return;
        this.Platform.api.progressSet( progress );
    }
    onResourcePreloadProgress( event ) {
        if ( !event.data || event.data.name != "Preload" ) return;
        Log.l( event.data.progress );
        this.progressSet( event.data.progress );
        this.dispatchEvent( new ResourcesEvent( ResourcesEvent.PROGRESS, event.target, event.data ) );
    }
    onResourcePreloadReady( event ) {
        this.resourceReady = true;
        this.destroyResourceProgress();
        this._platformReadySet();
        this.dispatchEvent( new ResourcesEvent( ResourcesEvent.READY, event.target, event.data ) );
    }
    loadingScreenStart() {
        const step = this.stepMachine.step;
        if ( !step ) return;
        step.stop();
    }

    

    //
    // VO
    //

    setVO( vo ) {
        this.vo = vo;
    }
    setHTMLElement( HTMLElement ) {
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.HTML_UPDATE, { HTMLElement } ) );
    }


    //
    // Storage
    //

    /**
     * Вернуть полный storage
     */
    storageGetAll() {
        if ( !this.storageData ) this.storageData = { };
        return this.storageData;
    }

    /**
     * Обновить хранилище полностью
     * @param { Object } object 
     */
    storageSetAll( object = { } ) {
        for ( const key in object ) {
            this.storageSet( key, object[ key ] );
        }
    }

    /**
     * Добавить значение по ключу
     * @param { String } name 
     * @param { Any } defaultValue 
     */
    storageGet( name, defaultValue = null ) {
        if ( !this.storageData ) this.storageData = { };
        if ( this.storageIsKey( name ) ) return this.storageData[ name ];
        return defaultValue;
    }

    /**
     * Прочитать значение по ключу
     * @param { String } name 
     * @param { Any } value 
     */
    storageSet( name, value ) {
        if ( !this.storageData ) this.storageData = { };
        this.storageData[ name ] = value;
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.STORAGE_UPDATE, { storage: this.storageData, key: name } ) );
    }

    /**
     * Проверить наличие ключа данных
     * @param { String } name 
     */
    storageIsKey( name ) {
        return this.storageData && this.storageData.hasOwnProperty( name );
    }

    /**
     * Метод отвечающий за тригер взаимодействия
     */
    interaction() {
        this.isInteract = true;
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.INTERACTION, { isInteract: true } ) );
    }

}