import EventDispatcherVOWrapper from "../../../../../data/vo/EventDispatcherVOWrapper";

export default class DisplayObject extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { DisplayObjectVO } displayObjectVO
     */
    constructor( displayObjectVO ) {
        super( displayObjectVO );
        this.init();
    }

    //
    // GET/SET
    //

    get enable() { return this._enable; }
    set enable( value ) { this._enable = value; }

    get group() { return this.vo.group; }
    set group( value ) { this.vo.group = value; }

    get stage() { return this._stage; }

    get parent() { return this._parent; }
    set parent( value ) {
        this._parent = value;
        this._updateStage();
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get width() { return this._width; }
    get height() { return this._height; }

    //
    // INIT
    //

    init() {
        if ( this._inited ) return;
        this._inited = true;
        this._initVars();
    }

    _initVars() {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
        this.name = this.vo.name;
    }

    _updateStage() {
        if ( this._parent && this._parent.stage && !this._stage ) {
            this._stage.addToDisplay( this );
            this._stage = this._parent.stage;
        } else {
            if ( this._stage ) {
                this._stage.removeFromDisplay( this );
            }
            this._stage = null;
        }
    }

}