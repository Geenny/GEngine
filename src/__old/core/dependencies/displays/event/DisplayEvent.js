import Event from "../../../machines/event/Event";

export default class DisplayEvent extends Event {

    constructor( type ) {

        super( type );

    }
    
}

DisplayEvent.VEIW_ELEMENT_READY = "displayViewElementReady";
DisplayEvent.BEFORE_RENDER = "displayBeforeRender";
DisplayEvent.AFTER_RENDER = "displayAfterRender";
