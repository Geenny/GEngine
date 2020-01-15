import DependencyAbstract from "../../../machines/dependency/DependencyAbstract";
import EngineVO from "./vo/EngineVO";
import ScreenManager from "../content/screen/ScreenManager";
import ScreenManagerVO from "../content/screen/vo/ScreenManagerVO";

export default class Engine extends DependencyAbstract {

    /**
     * 
     * @param { EngineVO } engineVO Наследник @DependencyVO
     */
    constructor( engineVO = new EngineVO() ) {
        super( engineVO );
    }

    //
    // GET/SET
    //

    get display() { return this.application.display; }
    get width() { return this.display.size.x; }
    get height() { return this.display.size.y; }
    get startUIX() { return Math.floor( this.display.size.x * 0.5 ); }
    get startUIY() { return -Math.floor( this.display.size.y * 0.5 ); }


    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
    }
    _initVars() {
        this._view = null;
    }
    subscribe() {
        // this.application.addEventListener( ResizeEvent.RESIZE, this.onResize, this );
    }
    unsubscribe() {
        // this.application.removeEventListener( ResizeEvent.RESIZE, this.onResize, this );
    }


    //
    // DEPENDENCY
    //

    /**
     * 
     */
    startProcess() {
        this.startMainModules();
    }

    stopProcess() {
        this.stopComplete();
    }


    //
    // MODULES
    //

    startMainModules() {
        const screenManagerVO = new ScreenManagerVO( this.vo.screenManagerVOData );
        this.screenManager = new ScreenManager( screenManagerVO );
        this.screenManager.init();
    }

}