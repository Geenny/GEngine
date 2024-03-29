import EventDispatcherVOWrapper from "../../../data/vo/EventDispatcherVOWrapper";
import StepEvent from "./events/StepEvent";
import StructUtils from "../../../data/content/struct/StructUtils";
import MouseEvent from "../../dependencies/systems/mouse/MouseEvent";
import Struct from "../../../data/content/struct/Struct";
import StepVO from "./vo/StepVO";
import DependencyMachineEvent from "../dependency/events/DependencyMachineEvent";
import DependencyName from "../../dependencies/DependencyName";
import Log from "../../../utils/log/Log";

export default class StepMachine extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { StepMachineVO } vo 
     */
    constructor( vo ) {
        super( vo );
    }


    //
    // GET/SET
    //
    get stepStructList() { return this.vo.stepStructList; }
    get stepsList() { return this.vo.steps; }
    get step() { return this._step; }
    get previousStep() { return this._previousStep; }
    get application() { return this.vo.application; }


    // 
    // INIT
    //
    init() {
        this.initVars();
        this._initSteps();
        this._listenersAdd();
    }
    initVars() {
        this._step = null;
        this._previousStep = null;
        this._stepList = [];
    }

    _initSteps() {
        if ( !this.stepsList ) return;
        this._stepStructListCreate();
        this._stepListCreate();
        this.stepListCheck();
    }
    _stepStructGet( i, options ) {
        const struct = {
            ...Struct,
            ID: i + 1,
            name: options.name,
            class: options.step,
            classVO: StepVO,
            options
        };
        return struct;
    }
    _stepStructListCreate() {
        const structList = [];
        for ( let i = 0; i < this.stepsList.length; i++ ) {
            const stepData = this.stepsList[ i ];
            const stepStruct = this._stepStructGet( i, stepData );
            structList.push( stepStruct );
        }
        this.vo.stepStructList = structList;
    }
    _stepListCreate() {
        for ( let i = 0; i < this.stepStructList.length; i++ ) {
            const stepStruct = this.stepStructList[ i ];
            const step = this._stepCreate( stepStruct );
            this._stepToListAdd( step );
        }
    }

    _startDefaultStep() {
        if ( this.step ) return;
        let defaultStep = this._stepList[ 0 ];
        for ( let i = 0; i < this._stepList.length; i++ ) {
            const step = this._stepList[ i ];
            if ( !step.isDefault ) continue;
            defaultStep = step;
            break;
        }
        
        if ( defaultStep )
            defaultStep.start();
    }

    _listenersAdd() {
        if ( this.isListeners ) return;
        this.isListeners = true;
        this.application.addEventListener( MouseEvent.UP, this.onApplicationClick, this );
        this.application.addEventListener( DependencyMachineEvent.DEPENDENCY_STARTED, this.onDependencyStarted, this );
    }
    _listenersRemove() {
        if ( !this.isListeners ) return;
        this.isListeners = false;
        this.application.removeEventListener( MouseEvent.UP, this.onApplicationClick, this );
        this.application.removeEventListener( DependencyMachineEvent.DEPENDENCY_STARTED, this.onDependencyStarted );
    }

    onApplicationClick( event ) {
        if ( !this.step || !this.step.skip ) return;
        if ( !this.step.started ) return;
        if ( this.step.worktime < 10 ) return;
        this.step.stop();
    }
    onDependencyStarted( event ) {
        if ( !event.dependency || event.dependency.name != DependencyName.ENGINE ) return;
        this._startDefaultStep();
    }


    //
    // STEP
    //

    stepListCheck() {
        for ( let i = 0; i < this._stepList.length; i++ ) {
            const step = this._stepList[ i ];
            const list = [];
            for ( let nameIndex = 0; nameIndex < step.vo.stepNames.length; nameIndex++ ) {
                const name = step.vo.stepNames[ nameIndex ];
                for ( let j = 0; j < this._stepList.length; j++ ) {
                    const childStep = this._stepList[ j ];
                    if ( childStep.ID != name && childStep.name != name ) continue;
                    list.push( childStep );
                }
            }
            if ( step.vo.stepNames.length > list.length ) {
                this.dispatch( new StepEvent( StepEvent.ERROR, this, step ) );
                throw new Error( "StepMachine: Step error." );
            }
            step.vo.steps = list;
        }
    }

    /**
     * @param { Step } step 
     */
    start( step ) {
        if ( this.step ) this.stop( this.step, -1 );
        this._step = step;
        Log.l( "Step starting:", step.name );
        step.onStart();
        this.dispatch( new StepEvent( StepEvent.START, this, step ) );
    }
    stop( step, id = 0, parameters = null ) {
        if ( this.step != step ) return false;
        const nextStep = this._previousStepNextGet( step, id );
        if ( !nextStep || nextStep === step ) return false;
        this._stopAnyway( step );
        this._previousStep = this.step;
        this._step = null;
        if ( id >= 0 ) this._stepNext( nextStep, parameters );
        return true;
    }
    stepUniquieIDGet() {
        let uniquieID = 1;
        for ( let i = 0; i < this._stepList.length; i++ ) {
            const step = this._stepList[ i ];
            if ( step.ID != uniquieID ) continue;
            i = 0;
            uniquieID ++;
        }
        return uniquieID;
    }
    _stopAnyway( step ) {
        if ( !step ) return;
        step.onStop();
        this.dispatch( new StepEvent( StepEvent.STOP, this, step ) );
        Log.l( "Step stopped:", this.step.name );
    }
    _stepNext( nextStep, parameters ) {
        if ( this.step || !nextStep ) return;
        nextStep.start( parameters );
    }
    _stepToListAdd( step ) {
        this._stepList.push( step );
    }
    _previousStepNextGet( previousStep, id = 0 ) {
        if ( !previousStep ) return null;
        return previousStep.steps[ id ] || previousStep.steps[ 0 ];
    }
    _stepCreate( stepStruct ) {
        if ( stepStruct.options ) { stepStruct.options.stepMachine = this; }
        const step = StructUtils.createStruct( stepStruct );
        // step.vo.ID = this.stepUniquieIDGet();
        return step;
    }

    dispatch( event ) {
        if ( !event ) return;
        this.dispatchEvent( event );
    }


    /**
     * Destroy machine
     */
    destroy() {
        this._listenersRemove();
        this._stopAnyway( this.step );
    }
}