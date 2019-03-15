import Event from "../../machines/event/Event";

export default class SMEvent extends Event {

    constructor( type ) {
        super( type );
    }
    
}

SMEvent.SYSTEM_ADD = "systemsSystemAdd";
SMEvent.SYSTEM_REMOVE = "systemsSystemRemove";
SMEvent.SYSTEM_START = "systemsSystemStart";
SMEvent.SYSTEM_STOP = "systemsSystemStop";
