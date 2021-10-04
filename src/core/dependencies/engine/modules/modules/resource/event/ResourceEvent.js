import Event from "../../../../../../machines/event/Event";

export default class ResourceEvent extends Event {

    constructor( type, resource, content ) {
        super( type );
        this.resource = resource;
        this.content = content;
    }
    
}

ResourceEvent.COMPLETE = "resourceComplete";
ResourceEvent.NONE = "resourceNone";
ResourceEvent.LOADING = "resourceLoading";
ResourceEvent.READY = "resourceReady";
ResourceEvent.PRELOAD_READY = "resourcePreloadReady";
ResourceEvent.ERROR = "resourceError";
