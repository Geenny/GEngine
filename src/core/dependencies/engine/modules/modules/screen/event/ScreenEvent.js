import Event from "../../../../../../machines/event/Event";

export default class ScreenEvent extends Event {

    /**
     * @param { String } type 
     * @param { ScreenStruct } screenStruct 
     */
    constructor( type, screen ) {
        super( type );
        this.screen = screen;
    }
    
}

ScreenEvent.INIT = "screenInit";
ScreenEvent.CREATE = "screenCreate";
ScreenEvent.DESTROY = "screenDestroy";
ScreenEvent.ADD = "screenAdd";
ScreenEvent.REMOVE = "screenRemove";
ScreenEvent.SHOW_START = "screenShowStart";
ScreenEvent.SHOW = "screenShow";
ScreenEvent.HIDE_START = "screenHideStart";
ScreenEvent.HIDE = "screenHide";
