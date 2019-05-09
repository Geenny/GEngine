import Event from "../../event/Event";

export default class NetworkEvent extends Event {

    constructor( type,  ) {
        super( type );
    }
    
}

NetworkEvent.INIT = "networkInit";
NetworkEvent.SEND = "networkSend";
NetworkEvent.REQUEST = "networkRequest";
