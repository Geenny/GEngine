import Event from "../../machines/event/Event";

export default class ApplicationEvent extends Event {

    constructor( type ) {
        super( type );
    }
    
}

ApplicationEvent.NONE = "none";
ApplicationEvent.ACTIVE = "applicationActive";
ApplicationEvent.DEACTIVE = "applicationDeactive";
