import Event from "../../../machines/event/Event";

export default class DeviceEvent extends Event {

    constructor( type, deviceSystem, orientation ) {
        super( type );
        this.deviceSystem = deviceSystem;
        this.orientation = orientation;
    }
    
}

DeviceEvent.ORIENTATION_CHANGE = "orientationChange";
