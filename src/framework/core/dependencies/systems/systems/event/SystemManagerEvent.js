import Event from "../../../../machines/event/Event";

export default class SystemManagerEvent extends Event {

    constructor( type, systemsManager, system = null ) {
        super( type );
        this.systemsManager = systemsManager;
        this.system = system;
    }
    
}

SystemManagerEvent.SYSTEM_ADD = "systemsSystemAdd";
SystemManagerEvent.SYSTEM_REMOVE = "systemsSystemRemove";
SystemManagerEvent.SYSTEM_START = "systemsSystemStart";
SystemManagerEvent.SYSTEM_STOP = "systemsSystemStop";
