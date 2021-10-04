import Event from "../../../../machines/event/Event";

export default class LoaderEvent extends Event {

    constructor( type, request ) {
        super( type );
        this.request = request;
    }
    
}

LoaderEvent.ADD = "loaderAdd";
LoaderEvent.TO_SEND = "loaderToSend";
LoaderEvent.SEND = "loaderSend";
LoaderEvent.INIT = "loaderInit";
LoaderEvent.PENDING = "loaderPending";
LoaderEvent.PROGRESS = "loaderProgress";
LoaderEvent.COMPLETE = "loaderComplete";
LoaderEvent.ERROR = "loaderError";
LoaderEvent.CANCEL = "loaderCancel";

LoaderEvent.TEST_START = "loaderTestStart";
LoaderEvent.TEST_COMPLETE = "loaderTestComplete";
