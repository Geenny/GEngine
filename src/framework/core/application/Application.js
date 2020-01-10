import Systems from "../dependencies/systems/systems/Systems";
import EventDispathcer from "../machines/event/EventDispatcher";
import ApplicationEvent from "./event/ApplicationEvent";
import ApplicationVO from "./vo/ApplicationVO";
import Log from "../../utils/log/Log";
import DependencyMachine from "../machines/dependency/DependencyMachine";
import DependencyMachineVO from "../machines/dependency/vo/DependencyMachineVO";
import Event from "../machines/event/Event";
import DependencyMachineEvent from "../machines/dependency/events/DependencyMachineEvent";
import TickerMachine from "../machines/ticker/TickerMachine";
import TickerMachineVO from "../machines/ticker/vo/TickerMachineVO";

export default class Application extends EventDispathcer {

    /**
     * 
     * @param {ApplicationVO} vo 
     */
    constructor( vo = new ApplicationVO() ) {

        super();

        this.setVO( vo );
        this.setHTMLElement( vo.HTMLElement );

        Log.l("Application Started!!!");

    }


    //
    // GET/SET
    //

    /**
     * Main HTMLElement
     */
    get HTMLElement() { return this.vo.HTMLElement; }

    
    //
    // INIT
    //

    init() {
        this._initVars();
        this.initTickerMachine();
        this.initDependencyMachine();
    }

    _initVars() {
        this.applicationDisplay = null;
    }

    initDependencyMachine() {
        const dependencyMachineVO = this.dependencyMachineVOGet();
        const dependencyMachine = new DependencyMachine( dependencyMachineVO );
        dependencyMachine.addEventListener( Event.ANY, this.onDependencyMachineEvent, this );
        dependencyMachine.init();

        this.dependencyMachine = dependencyMachine;
    }
    onDependencyMachineEvent( event ) {
        const dependency = event.dependency;
        if ( dependency ) {
            if ( dependency instanceof Systems ) {
                this.systems = dependency;
            }
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
    // VO
    //

    setVO( vo ) {
        this.vo = vo;
    }
    setHTMLElement( HTMLElement ) {
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.HTML_UPDATE, { HTMLElement } ) );
    }

}