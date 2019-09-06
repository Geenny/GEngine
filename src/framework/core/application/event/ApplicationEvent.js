import Event from "../../machines/event/Event";

export default class ApplicationEvent extends Event {

    constructor( type, data = {} ) {
        super( type );
        this.data = data;
    }
    
}

ApplicationEvent.NONE = "none";
ApplicationEvent.ACTIVE = "applicationActive";
ApplicationEvent.DEACTIVE = "applicationDeactive";
ApplicationEvent.HTML_UPDATE = "applicationHTMLUpdate";
