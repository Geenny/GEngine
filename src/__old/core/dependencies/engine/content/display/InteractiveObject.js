import EventDispatcherVOWrapper from "../../../../../data/vo/EventDispatcherVOWrapper";

export default class InteractiveObject extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { InteractiveObjectVO } interactiveObjectVO
     */
    constructor( interactiveObjectVO ) {
        super( interactiveObjectVO );
        this.init();
    }

    //
    // GET/SET
    //

    get inited() { return this._inited; }

    get interactive() { return this.vo.interactive; }
    set interactive( value ) {
        if ( typeof value != 'boolean' ) debugger;
        this.vo.interactive = !!value;
    }

    get buttonMode() { return this.vo.buttonMode; }
    set buttonMode( value ) { this.vo.buttonMode = !!value; }

    get hitArea() { return this._hitArea; }
    set hitArea( value ) { this._hitArea = value; }


    //
    // INIT
    //

    init() {
        this._initInteractiveObjectVars();
        this._inited = true;
    }

    _initInteractiveObjectVars() {
        this._inited = false;
        this._hitBox = this.vo.hitBox;
        this._hitArea = null;
    }

}