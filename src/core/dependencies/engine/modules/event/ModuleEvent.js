import Event from "../../../../machines/event/Event";

export default class ModuleEvent extends Event {

    constructor( type, modules, module ) {
        super( type );
        this.modules = modules;
        this.module = module;
    }
    
}

ModuleEvent.START = "moduleStart";
ModuleEvent.STOP = "moduleStop";
ModuleEvent.INIT = "moduleInit";
ModuleEvent.ERROR = "moduleError";
