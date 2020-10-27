import Module from "../../Module";
import ArrayUtils from "../../../../../../utils/tech/ArrayUtils";
import WindowsVO from "./vo/WindowsVO";
import StructUtils from "../../../../../../data/content/struct/StructUtils";
import AbstractWindow from "./window/AbstractWindow";
import WindowVO from "./vo/WindowVO";
import ObjectUtils from "../../../../../../utils/tech/ObjectUtils";

export default class Windows extends Module {

    /**
     * @param { WindowsVO } windowsVO
     */
    constructor( windowsVO = new WindowsVO() ) {
        super( windowsVO );
    }


    //
    // GET/SET
    //

    get inited() { return this._inited; }
    get debug() { return false; }

    get window() { return this._window; }
    get windowList()  { return this.vo.windowList; }
    get windowStructList()  { return this.vo.windowStructList; }


    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;
        this._initWindowManagerVars();
        this._initWindows();
    }
    _initWindowManagerVars() {
        //
    }
    _initWindows() {
        for ( let i = 0; i < this.windowStructList.length; i++ ) {
            const windowStruct = this.windowStructList[ i ];
            this._windowAddByStruct( windowStruct );
        }
    }


    //
    // DESTROY
    //

    destroy() {
        ObjectUtils.destroyList( this.windowList );
    }


    //
    // RESIZE
    //

    resize( size ) {
        super.resize( size );
        this.resizeWindows();
    }
    resizeWindows() {
        for ( let i = 0; i < this.windowList.length; i++ ) {
            const window = this.windowList[ i ];
            window.resize( this.size );
        }
    }


    //
    // 
    //

    windowShowByID( windowID ) {

    }

    _windowAddByStruct( windowStruct ) {
        windowStruct.options.application = this.application;
        const windowStruct = StructUtils.createStruct( windowStruct, AbstractWindow, WindowVO );
        // this.win
    }

}
