import Event from "../../../machines/event/Event";

export default class MouseEvent extends Event {

    constructor( type, x, y, touchID = 0 ) {
        super( type );
        this.x = x;
        this.y = y;
        this.touchID = touchID;
    }
    
}

MouseEvent.CLICK = "mouseClick";
MouseEvent.DOWN = "mouseDown";
MouseEvent.UP = "mouseUp";
MouseEvent.MOVE = "mouseMove";
MouseEvent.OVER = "mouseOver";
MouseEvent.OUT = "mouseOut";
MouseEvent.ENTER = "mouseEnter";
MouseEvent.LEAVE = "mouseLeave";
MouseEvent.CANCEL = "mouseCancel";

