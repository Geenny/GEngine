import SystemAbstract from "../systems/SystemAbstract";
import KeyboardEvent from "./KeyboardEvent";

export default class KeyboardSystem extends SystemAbstract {

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
    initVO( vo ) {
        this.vo = vo;
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
        document.addEventListener( "keydown", this.onDown );
        document.addEventListener( "keyup", this.onUp );
    }

    listenersUnset() {
        if ( !this.onDown || !this.onUp ) return;
        document.removeEventListener( "keydown", this.onDown );
        document.removeEventListener( "keyup", this.onUp );
        this.onDown = null;
        this.onUp = null;
    }


    //
    // LISTENERS
    // 

    setListeners() {
        this.onDown = ( event ) => {
            this.dispatch( new KeyboardEvent( KeyboardEvent.DOWN, event.key, event.location, event.keyCode ) );
        };
        this.onUp = ( event ) => {
            this.dispatch( new KeyboardEvent( KeyboardEvent.UP, event.key, event.location, event.keyCode ) );
        };
    }
}