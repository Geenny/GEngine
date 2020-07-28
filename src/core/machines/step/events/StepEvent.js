import Event from "../../event/Event";

export default class StepEvent extends Event {

    constructor( type, stepMachine, step ) {
        super( type );
        this.stepMachine = stepMachine;
        this.step = step;
    }
    
}

StepEvent.INIT = "stepInit";
StepEvent.START = "stepStart";
StepEvent.STOP = "stepStop";
