import Event from "../../../machines/event/Event";

export default class DeviceEvent extends Event {

    constructor( type, orientation ) {
        super( type );
        this.orientation = orientation;
    }
    
}

DeviceEvent.ORIENTATION_CHANGE = "orientationChange";
