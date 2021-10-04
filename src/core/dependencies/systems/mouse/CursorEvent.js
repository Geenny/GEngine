import Event from "../../../machines/event/Event";
import CursorTypes from "./CursorTypes";

export default class CursorEvent extends Event {

    constructor( type, cursorType = CursorTypes.DEFAULT ) {
        super( type );
        this.cursorType = type === CursorEvent.RESET ? CursorTypes.DEFAULT : cursorType;
    }
    
}

CursorEvent.CHANGE = "cursorClick";
CursorEvent.RESET = "cursorDown";

