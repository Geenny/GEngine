import Event from "../../../machines/event/Event";

export default class KeyboardEvent extends Event {

    constructor( type, key, location, code ) {
        super( type );
        this.key = key;
        this.location = location;
        this.code = code;
    }
    
}

KeyboardEvent.DOWN = "down";
KeyboardEvent.UP = "up";
