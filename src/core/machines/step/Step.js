import EventDispatcherVOWrapper from "../../../data/vo/EventDispatcherVOWrapper";
import TimeSystem from "../../dependencies/systems/time/TimeSystem";

export default class Step extends EventDispatcherVOWrapper {

    constructor( stepVO = new StepVO() ) {
        super( stepVO );
    }

    //
    // GET/SET
    //
    get started() { return this._started; }
    get worktime() { return TimeSystem.now - this.starttime; }
    get starttime() { return this._starttime || 0; }

    get ID() { return this.vo.ID; }
    get name() { return this.vo.name; }
    get skip() { return this.vo.skip || false; }
    get isDefault() { return this.vo.isDefault || false; }

    get stepMachine() { return this.vo.stepMachine; }
    get application() { return this.stepMachine.application; }
    get previousStep() { return this.stepMachine.previousStep; }
    
    get steps() { return this.vo.steps; }
    get stepNames() { return this.vo.stepNames; }


    start( parameters ) {
        if ( this.started ) return;
        this._started = true;
        this._starttime = TimeSystem.now;
        this.parameters = parameters;
        this.stepMachine.start( this );
    }

    stop( id = 0, parameters = null ) {
        if ( !this.started ) return;
        if ( !this.stepMachine.stop( this, id, parameters ) ) return;
        this._started = false;
    }

    onStart() {}
    onStop() {}

    destroy() {}

}