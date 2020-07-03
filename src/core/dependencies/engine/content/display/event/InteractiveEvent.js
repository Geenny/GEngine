import Event from "../../../../../machines/event/Event";

export default class InteractiveEvent extends Event {

    constructor( type ) {
        super( type );
    }
    
}

InteractiveEvent.ON = "interactiveOn";
InteractiveEvent.OFF = "interactiveOff";
