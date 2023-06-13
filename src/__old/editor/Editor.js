import Application from "../core/application/Application";
import Event from "../core/machines/event/Event";
import ApplicationEvent from "../core/application/event/ApplicationEvent";

export default class Editor {

    constructor( application ) {
        this.application = application;
    }


    //
    // GET/SET
    //
    get isApplication() {
        return this.application && this.application instanceof Application;
    }



    //
    // INIT
    //
    init() {
        this._applicationListenersSet();
    }
    _applicationListenersSet() {
        if ( !this.isApplication ) return;
        this._applicationListenersUnset();
        this.application.addEventListener( Event.ANY, this._onApplicationHandle, this );
    }
    _applicationListenersUnset() {
        if ( !this.isApplication ) return;
        this.application.removeEventListener( Event.ANY, this._onApplicationHandle );
    }
    _onApplicationHandle( event ) {
        switch( event.type ) {
            case ApplicationEvent.READY:
                debugger;
                break;
        }
    }

    destroy() {
        this._applicationListenersUnset();
        this.application = null;
    }

}