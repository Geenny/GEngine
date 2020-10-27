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
import ERRORS from "../../config/ERRORS";
import { utils } from "pixi.js";

export default class Application extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { ApplicationVO } vo 
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

        this.stepMachine.removeEventListener( StepEvent.ANY, this.onStepMachineHandle );
        this.dependencyMachine.removeEventListener( Event.ANY, this.onDependencyMachineEvent );

        utils.clearTextureCache();
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


    //
    // INTERACTION SET
    //

    /**
     * Метод отвечающий за тригер взаимодействия
     */
    interaction() {
        this.isInteract = true;
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.INTERACTION, { isInteract: true } ) );
    }


    //
    // ROOT ADD/REMOVE
    //

    /**
     * Добавить @module объект в рут
     * @param { Object } module 
     * @param { String } rootName 
     */
    rootAdd( module, rootName = null ) {
        if ( !module.name )
            throw new Error( ERRORS.E1002 );
 
        if ( !this._rootCheckForAdd( rootName ) )
            throw new Error( ERRORS.E1003 );

        const modules = rootName ? this[ rootName ] : this;
        if ( modules[ module.name ] )
            throw new Error( ERRORS.E1004 );
        
        modules[ module.name ] = module;
    }

    /**
     * Удалить @module объект из рута 
     * @param { Object } module 
     * @param { String } rootName 
     */
    rootRemove( module, rootName = null ) {
        const modules = rootName ? this[ rootName ] : this;
        delete modules[ module.name ];
        this._rootCheckForRemove();
    }

    _rootCheckForAdd( rootName ) {
        const modules = rootName ? this[ rootName ] : this;
        if ( modules ) return true;
        if ( rootName ) {
            this[ rootName ] = { };
            return true;
        }
        return false;
    }
    _rootCheckForRemove( rootName ) {
        if ( !rootName ) return;
        const modules = this[ rootName ];
        const length = ObjectUtils.count( modules );
        if ( modules && length <= 0 ) {
            delete this[ rootName ];
        }
    }

}