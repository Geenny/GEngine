import DisplayObject from "./DisplayObject";
import InteractiveManager from "../../interactive/InteractiveManager";

export default class InteractiveObject extends DisplayObject {

    /**
     * 
     * @param { InteractiveObjectVO } interactiveObjectVO
     */
    constructor( interactiveObjectVO ) {
        super( interactiveObjectVO );
    }

    //
    // GET/SET
    //

    get interactive() { return this._interactive; }
    set interactive( value ) {
        this._interactive = !!value;
    }


    //
    // INIT
    //

    init() {
        super.init();
        this._initInteractiveObjectVars();
    }

    _initInteractiveObjectVars() {
        this.interactive = this.vo.interactive || false;
        this._hitBox = this.vo.hitBox;
    }

}