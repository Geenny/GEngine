import State from "./State";
import EventDispatcher from "./../event/EventDispatcher";
import StateMachineEvent from "./events/StateMachineEvent";

export default class StateMachine extends EventDispatcher {

    /**
     * 
     * @param {StateMachineVO} vo 
     */
    constructor( vo ) {
        super();
        this.init( vo );
    }

    /**
     * 
     * @param {StateMachineVO} vo 
     */
    init( vo ) {
        this.initVars();
        this.initVO( vo );
    }

    /**
     * 
     * @param {StateMachineVO} vo 
     */
    initVO( vo ) {
        this.vo = vo;
        this._statesCreateFromVO();
    }

    initVars() {
        this._stateList = {};
    }

    //
    // GET/SET
    //
    get stateList() { return this._stateList; }

    /**
     * 
     */
    get state() { return this._stateCurrent; }
    get statePrevious() { return this._statePrevious; }

    /**
     * 
     */
    get interpolate() { return this.vo.interpolate || false; }
    get chained() { return this.vo.chained || false; }


    //
    // STATE
    //

    /**
     * 
     * @param { string | State } stateName 
     */
    stateSet( state ) {
        const targetState = this.stateCorrection( state );
        if ( targetState ) {
            if ( this._stateCurrentToggleCan( targetState.name ) ) {
                if ( this.interpolate ) {
                    this._stateCandidateAdd( targetState );
                } else {
                    this._stateStart( targetState );
                }
            }
        }
    }

    /**
     * State toggle init
     */
    stateExit() {
        if ( this._stateCandidateList.length === 0 ) return;
        const state = this._stateCandidateList.shift();
        this._stateStart( state );
    }


    

    isState( value ) {
        return value instanceof State;
    }
    isStateName( value ) {
        return typeof value === "string";
    }

    hasState( value ) {
        if ( this.isState( value ) ) {
            return this.stateList[ value.name ];
        } else if ( this.isStateName( value ) ) {
            const state = this.stateByNameGet( value );
            return state && state.name === value;
        }
        return false;
    }
    stateCorrection( value ) {
        if ( this.isState( value ) ) {
            return value;
        } else if ( this.isStateName( value ) ) {
            return this.stateByNameGet( value );
        }
        return null;
    }

    /**
     * 
     * @param {State} state 
     */
    stateAdd( state ) {
        if ( !( state instanceof State ) ) return;
        this._stateAdd( state );
        return this;
    }

    stateRemove( state ) {
        this._removeState( state );
        return this;
    }

    stateByNameGet( stateName ) {
        return this.stateList[ stateName ];
    }

    _stateAdd( state ) {
        if ( state && state.name && !this.hasState( state ) ) {
            this.stateList[ state.name ] = state;
        }
    }
    _removeState( state ) {
        if ( state && this.stateList.hasOwnProperty( state.name ) ) {
            delete this.stateList[ state.name ];
        }
    }

    _stateCandidateAdd( state ) {
        this._stateCandidateList.push( state );
        this.dispatchEvent( new StateMachineEvent( StateMachineEvent.CHANGING, this, state, this.state ) );
    }

    _stateStart( state ) {
        this._stateSet( state );
        this.dispatchEvent( new StateMachineEvent( StateMachineEvent.CHANGE, this, state, this.statePrevious ) );
    }

    _stateSet( state ) {
        this._statePrevious = this._stateCurrent;
        this._stateCurrent = state;
    }

    _stateCurrentToggleCan( stateName ) {
        return !this.chained ||
            !this.state ||
            ( this.state && this.state.input.indexOf( stateName ) != -1 );
    }

    _statesCreateFromVO() {
        if ( this.vo && this.vo.states ) {
            for ( const key in this.vo.states ) {
                const stateName = this.vo.states[ key ];
                if ( stateName ) {
                    this._stateAdd( new State( stateName ) );
                }
            }
        }
    }

}