import Event from "../../../../../machines/event/Event";

export default class ScreenEvent extends Event {

    /**
     * @param { String } type 
     * @param { ScreenStruct } screenStruct 
     */
    constructor( type, screenStruct ) {
        super( type );
        this.screenStruct = screenStruct;
    }
    
}

ScreenEvent.CREATE = "screenCreate";
ScreenEvent.DESTROY = "screenDestroy";
ScreenEvent.ADD = "screenAdd";
ScreenEvent.REMOVE = "screenRemove";
ScreenEvent.SHOW = "screenShow";
ScreenEvent.HIDE = "screenHide";
