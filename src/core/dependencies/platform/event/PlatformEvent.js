import Event from "../../../machines/event/Event";

export default class PlatformEvent extends Event {

    constructor( type, platform, data = {} ) {
        super( type );
        this.platform = platform;
        this.data = data;
    }
    
}

PlatformEvent.INIT = "PlatformInit";
PlatformEvent.START = "PlatformStart";
PlatformEvent.PROGRESS = "PlatformProgress";
PlatformEvent.FRIENDS = "PlatformFriends";
PlatformEvent.READY = "PlatformReady";
PlatformEvent.DATA_SET = "PlatformDataSet";
PlatformEvent.DATA_GET = "PlatformDataGet";
PlatformEvent.ERROR = "PlatformError";
