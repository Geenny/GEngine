import Event from "../../event/Event";

export default class StateMachineEvent extends Event {

    constructor( type, stateMachine, state = null ) {
        super( type );
        this.stateMachine = stateMachine;
        this.state = state;
    }
    
}

StateMachineEvent.ADD = "stateMachineAdd";
StateMachineEvent.REMOVE = "stateMachineRemove";
StateMachineEvent.CHANGE = "stateMachineChange";
StateMachineEvent.CHANGING = "stateMachineChanging";
