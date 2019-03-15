import EventDispathcer from "../event/EventDispatcher";
import DependencyVO from "./vo/DependencyVO";
import StateMachine from "../state/StateMachine";
import StateMachineVO from "../state/vo/StateMachineVO";
import DependencyStates from "./states/DependencyState";
import DependencyEvent from "./events/DependencyEvent";
import { ERRORS } from "./../../../config/CONFIG";

export default class DependencyAbstract extends EventDispathcer {

    constructor( vo = new DependencyVO() ) {
        super();
        // if ( new.target === DependencyAbstract ) {
        //     throw new TypeError( ERRORS.E1000 );
        // }
        this._setVO( vo );
    }

    //
    // GET/SET
    //

    get state() { return this.sm.state || DependencyStates.STOPPED; }
    set state( value ) { return this.sm.stateSet( value ); }


    //
    // INIT
    //

    init() {
        this.sm = new StateMachine( this.getStateMachineVO() );
    }
    getStateMachineVO() {
        const dataVO = {
            states: DependencyStates
        };
        return new StateMachineVO( dataVO );
    }


    //
    // 
    //

    start() {
        if ( this.state === DependencyStates.STOPPED ) {
            this.state = DependencyStates.STARTING;
            this.dispatchEvent( new DependencyEvent( DependencyEvent.STARTING ) );
            this.startProcess();
        } else {
            this.error();
        }
    }

    stop() {
        if ( this.state === DependencyStates.WORKING || 
            this.state === DependencyStates.STARTING ||
            this.state === DependencyStates.STARTED )
        {
            this.stopProcess();
        }
    }

    startProcess() {
        this.startComplete();
    }

    startComplete() {
        this.state = DependencyStates.STARTED;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.STARTED ) );
        this.state = DependencyStates.WORKING;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.WORKING ) );
    }
    
    stopProcess() {
        this.stopComplete();
    }

    stopComplete() {
        this.state = DependencyStates.STOPPED;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.STOPPED ) );
    }

    error() {
        this.state = DependencyStates.ERROR;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.ERROR ) );
    }

    _setVO( vo ) {
        this.vo = vo;
    }

}