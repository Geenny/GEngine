import Event from "../../../../machines/event/Event";

export default class ResourceEvent extends Event {

    constructor( type, resource, content ) {
        super( type );
        this.resource = resource;
        this.content = content;
    }
    
}

ResourceEvent.NONE = "resourceNone";
ResourceEvent.LOADING = "resourceLoading";
ResourceEvent.READY = "resourceReady";
ResourceEvent.ERROR = "resourceError";
