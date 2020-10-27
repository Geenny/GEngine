import SystemAbstract from "../systems/SystemAbstract";

export default class TimeSystem extends SystemAbstract {

    /**
     * Вернуть значение времени приложениия
     */
    static get time() {
        return TimeSystem.instance ? TimeSystem.instance.time : 0;
    }
    
    static get now() {
        return TimeSystem.instance ? TimeSystem.instance.now : 0;
    }

    constructor( vo ) {
        super( vo );
        this.init();
    }


    //
    // GET/SET
    //
    get now() { return Date.now(); }
    get starttime() { return this._starttime; }
    get time() { return this.now - this._starttime; }



    //
    // INIT
    //

    init() {
        TimeSystem.instance = this;
    }


    //
    //
    //

    start() {
        super.start();
        this._starttime = this.now;
    }

    stop() {
        TimeSystem.instance = null;
    }

}