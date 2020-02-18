import SystemAbstract from "../systems/SystemAbstract";
import MouseEvent from "./MouseEvent";

export default class MouseSystem extends SystemAbstract {

    constructor( vo ) {
        super( vo );
        this.init();
    }


    //
    // GET/SET
    //
    get application() { return this.target; }
    get applicationView() { return this.application.applicationView; }
    get htmlElement() { return this.applicationView.htmlElement; }



    //
    // INIT
    //

    init() {
        this.setListeners();
    }


    //
    //
    //

    start() {
        this.listenersSet();
        super.start();
    }

    stop() {
        this.listenersUnset();
        super.stop();
    }


    //
    // Listeners set/unset
    //

    listenersSet() {
        if ( this.isStarted ) return;
        document.addEventListener( "click", this.onClick );
        document.addEventListener( "mousedown", this.onDown );
        document.addEventListener( "mouseup", this.onUp );
        document.addEventListener( "mouseenter", this.onEnter );
        document.addEventListener( "mouseleave", this.onLeave );
        document.addEventListener( "mousemove", this.onMove );
        document.addEventListener( "mouseout", this.onOut );
        document.addEventListener( "mouseover", this.onOver );
    }

    listenersUnset() {
        if ( !this.onClick || !this.onDown || !this.onUp || !this.onEnter || !this.onLeave || !this.onMove || !this.onOut || !this.onOver ) return;
        document.removeEventListener( "click", this.onClick );
        document.removeEventListener( "mousedown", this.onDown );
        document.removeEventListener( "mouseup", this.onUp );
        document.removeEventListener( "mouseenter", this.onEnter );
        document.removeEventListener( "mouseleave", this.onLeave );
        document.removeEventListener( "mousemove", this.onMove );
        document.removeEventListener( "mouseout", this.onOut );
        document.removeEventListener( "mouseover", this.onOver );
        this.onClick = null;
        this.onDown = null;
        this.onUp = null;
        this.onEnter = null;
        this.onLeave = null;
        this.onMove = null;
        this.onOut = null;
        this.onOver = null;
    }


    //
    // LISTENERS
    // 

    setListeners() {
        this.onClick = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.CLICK, event.offsetX, event.offsetY ) );
        };
        this.onDown = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.DOWN, event.offsetX, event.offsetY ) );
        };
        this.onUp = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.UP, event.offsetX, event.offsetY ) );
        };
        this.onEnter = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.ENTER, event.offsetX, event.offsetY ) );
        };
        this.onLeave = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.CANCEL, event.offsetX, event.offsetY ) );
            this.dispatch( new MouseEvent( MouseEvent.LEAVE, event.offsetX, event.offsetY ) );
        };
        this.onMove = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.MOVE, event.offsetX, event.offsetY ) );
        };
        this.onOut = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.OUT, event.offsetX, event.offsetY ) );
        };
        this.onOver = ( event ) => {
            this.dispatch( new MouseEvent( MouseEvent.OVER, event.offsetX, event.offsetY ) );
        };
    }
}