import WindowsVO from "./vo/WindowsVO";
import EventDispathcer from "../../../../../../machines/event/EventDispatcher";
import Point from "../../../../../../../data/content/graphics/Point";
import WindowEvent from "../events/WindowEvent";

export default class AbstractWindow extends EventDispathcer {

    /**
     * @param { WindowsVO } windowsVO
     */
    constructor( windowVO = new WindowVO() ) {
        super( windowVO );
    }


    //
    // GET/SET
    //

    get inited() { return this._inited; }

    get ID() { return this.vo.ID; }
    get name() { return this.vo.name; }
    get popup() { return this.vo.popup; }
    get unique() { return this.vo.unique; }

    get content() { return this.vo.content; }
    get windows() { return this.vo.windows; }


    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;
        this._initVars();
    }

    _initVars() {
        this.size = new Point();
    }


    //
    // RESIZE
    //

    resize( size ) {
        this.size - size;
    }


    //
    // 
    //
    show() {
        this.dispatchEvent( new WindowEvent( WindowEvent.SHOW, this.windows, this ) );
    }
    showConplete() {
        this.dispatchEvent( new WindowEvent( WindowEvent.SHOW_COMPLETE, this.windows, this ) );
    }

    hide() {
        this.dispatchEvent( new WindowEvent( WindowEvent.HIDE, this.windows, this ) );
    }
    hideConplete() {
        this.dispatchEvent( new WindowEvent( WindowEvent.HIDE_COMPLETE, this.windows, this ) );
    }


    //
    // DESTROY
    //
    destroy() {
        this.dispatchEvent( new WindowEvent( WindowEvent.DESTROY, this.windows, this ) );
    }

}
