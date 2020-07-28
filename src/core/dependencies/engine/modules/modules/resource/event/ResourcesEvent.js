import Event from "../../../../../../machines/event/Event";

export default class ResourcesEvent extends Event {

    constructor( type, resources, data = {} ) {
        super( type );
        this.resources = resources;
        this.data = data;
    }
    
}

ResourcesEvent.ADD = "resourceAdd";
ResourcesEvent.REMOVE = "resourceRemove";
ResourcesEvent.PROGRESS = "resourceProgress";
ResourcesEvent.READY = "resourceReady";
