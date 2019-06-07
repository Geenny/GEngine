import Event from "../../event/Event";

export default class NetEvent extends Event {

    constructor( type,  ) {
        super( type );
    }
    
}

NetEvent.INIT = "networkInit";
NetEvent.SEND = "networkSend";
NetEvent.REQUEST = "networkRequest";
