import Event from "../../machines/event/Event";

export default class SystemEvent extends Event {

    constructor( type ) {
        super( type );
    }
    
}

SystemEvent.IDLE = "systemIdle";
SystemEvent.STARTED = "systemStarting";
SystemEvent.STARTING = "systemStarted";
SystemEvent.EVENT = "systemEvent";
SystemEvent.STOPING = "systemStoping";
SystemEvent.STOPPED = "systemStopped";
