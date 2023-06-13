import Event from "../../../../../../machines/event/Event";

export default class WindowEvent extends Event {

    /**
     * @param { String } type 
     * @param { ScreenStruct } screenStruct 
     */
    constructor( type, windows, window ) {
        super( type );
        this.windows = windows;
        this.window = window;
    }
    
}

WindowEvent.INIT = "windowInit";
WindowEvent.SHOW = "windowShow";
WindowEvent.SHOW_COMPLETE = "windowShowComplete";
WindowEvent.HIDE = "windowHide";
WindowEvent.HIDE_COMPLETE = "windowHideComplete";
WindowEvent.DESTROY = "windowDestroy";