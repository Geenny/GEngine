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
ApplicationEvent.RESIZE_DISPATCH = "applicationResizeDispatch";
ApplicationEvent.INIT = "applicationInit";
ApplicationEvent.START = "applicationStart";
ApplicationEvent.READY = "applicationReady";
ApplicationEvent.STORAGE_UPDATE = "applicationStorageUpdate";
ApplicationEvent.INTERACTION = "applicationInteraction";
