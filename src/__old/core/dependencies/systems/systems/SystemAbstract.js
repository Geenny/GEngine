import ERRORS from "../../../../config/ERRORS";
import SystemVO from "./vo/SystemVO";
import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";

export default class SystemAbstract extends EventDispatcherVOWrapper {

    constructor( systemVO = new SystemVO() ) {
        super( systemVO );
        if ( new.target === SystemAbstract )
            throw new TypeError( ERRORS.E1001 );
    }


    //
    // GET/SET
    //
    get name() { return this.vo.name; }
    get target() { return this.vo.target; }
    get isStarted() { return this._isStarted || false; }

    /**
     * Запуск системы. Система, в отличии от @dependency , запускается асинхронно,
     * не зависит от реализации и ньюансов работы внутри системы. После запуска она в любом слючае
     * будет числиться как работающая.
     */
    start() {
        this._isStarted = true;
    }

    stop() {
        this._isStarted = false;
    }

    /**
     * Отправить событие на @target
     * @param {Event} event 
     */
    dispatch( event ) {
        this.target && this.target.dispatchEvent( event );
    }

}