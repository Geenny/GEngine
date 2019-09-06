import Event from "../../../machines/event/Event";

export default class ResizeEvent extends Event {

    constructor( type, width, height, widthPage, heightPage ) {
        super( type );
        this.width = width;
        this.height = height;
        this.widthPage = widthPage;
        this.heightPage = heightPage;
    }
    
}

ResizeEvent.SET = "set";
ResizeEvent.RESIZE = "resize";
