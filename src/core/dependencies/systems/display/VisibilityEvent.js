import Event from "../../../machines/event/Event";

export default class VisibilityEvent extends Event {

    constructor( type, visibilityState ) {
        super( type );
        this.visibility = visibilityState === "visible";
        this.visibilityState = visibilityState;
    }
    
}

VisibilityEvent.CHANGE = "change";
