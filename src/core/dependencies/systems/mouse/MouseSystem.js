import SystemAbstract from "../systems/SystemAbstract";
import MouseEvent from "./MouseEvent";
import CursorTypes from "./CursorTypes";
import CursorEvent from "./CursorEvent";
import MobileDetect from "mobile-detect";

export default class MouseSystem extends SystemAbstract {

    constructor( vo ) {
        super( vo );
        this.init();
    }


    //
    // GET/SET
    //
    get application() { return this.target; }
    get HTMLElement() { return this.application.HTMLElement; }
    get defaultCursorType() { return this.vo.defaultCursorType || CursorTypes.DEFAULT; }

    get isMobile() {
        if ( this._ismobile === undefined ) this.isMobileUpdate();
        return this._ismobile;
    }
    get x() { return this._x; }
    get y() { return this._y; }



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
        this.cursorListenerSet();
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
        document.addEventListener( "touchstart", this.onDown);
        document.addEventListener( "touchmove", this.onMove);
        document.addEventListener( "touchend", this.onUp);
        document.addEventListener( "touchcancel", this.onLeave);
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
        document.removeEventListener( "touchstart", this.onDown );
        document.removeEventListener( "touchmove", this.onMove );
        document.removeEventListener( "touchend", this.onUp );
        document.removeEventListener( "touchcancel", this.onLeave );
        this.onClick = null;
        this.onDown = null;
        this.onUp = null;
        this.onEnter = null;
        this.onLeave = null;
        this.onMove = null;
        this.onOut = null;
        this.onOver = null;
    }


    isMobileUpdate() {
        const mobileDetect = new MobileDetect( window.navigator.userAgent );
        this._ismobile = !!mobileDetect.mobile() || !!mobileDetect.phone();
    }

    handleMouseEvent( event ) {
        if ( !event ) return;
        if ( this.isMobile && event.touches && event.touches[ 0 ] ) {
            this._x = event.touches[ 0 ].clientX;
            this._y = event.touches[ 0 ].clientY;
        } else {
            this._x = event.offsetX;
            this._y = event.offsetY;
        }
    }


    //
    // LISTENERS
    // 

    setListeners() {
        this.onClick = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.CLICK, this.x, this.y ) );
        };
        this.onDown = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.DOWN, this.x, this.y ) );
        };
        this.onUp = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.UP, this.x, this.y ) );
        };
        this.onEnter = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.ENTER, this.x, this.y ) );
        };
        this.onLeave = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.CANCEL, this.x, this.y ) );
            this.dispatch( new MouseEvent( MouseEvent.LEAVE, this.x, this.y ) );
        };
        this.onMove = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.MOVE, this.x, this.y ) );
        };
        this.onOut = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.OUT, this.x, this.y ) );
        };
        this.onOver = ( event ) => {
            this.handleMouseEvent( event );
            this.dispatch( new MouseEvent( MouseEvent.OVER, this.x, this.y ) );
        };
    }


    //
    // CURSOR
    //
    cursorListenerSet() {
        this.application.addEventListener( CursorEvent.CHANGE, ( event ) => {
            this.HTMLElement.style.cursor = event.cursorType;
        } );
        this.application.addEventListener( CursorEvent.RESET, ( event ) => {
            this.HTMLElement.style.cursor = event.cursorType;
        } );
    }
}