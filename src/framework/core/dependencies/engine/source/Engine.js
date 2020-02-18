import DependencyAbstract from "../../../machines/dependency/DependencyAbstract";
import EngineVO from "./vo/EngineVO";
import ScreenManager from "../content/screen/ScreenManager";
import ScreenManagerVO from "../content/screen/vo/ScreenManagerVO";
import Stage from "../content/display/Stage";
import StageVO from "../content/display/vo/StageVO";
import Resources from "../resource/Resources";
import ResourcesVO from "../resource/vo/ResourcesVO";
import ResizeEvent from "../../systems/display/ResizeEvent";
import InteractiveManager from "../interactive/InteractiveManager";
import InteractiveObjectVO from "../content/display/vo/InteractiveObjectVO";

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

    get display() { return this.application.applicationDisplay; }

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
        this.subscribe();
    }
    _initVars() {
        this._view = null;
    }
    subscribe() {
        this.application.addEventListener( ResizeEvent.RESIZE, this.onResize, this );
    }
    unsubscribe() {
        this.application.removeEventListener( ResizeEvent.RESIZE, this.onResize, this );
    }


    //
    // RESIZE
    //

    onResize( event ) {
        if ( this.stage ) {
            this.stage.width = event.width;
            this.stage.height = event.height;
            this.stage.resize();
        }

        if ( this.uistage ) {
            this.uistage.width = event.width;
            this.uistage.height = event.height;
            this.uistage.resize();
        }
    }


    //
    // DEPENDENCY
    //

    /**
     * 
     */
    startProcess() {
        this.startMainModules();
        this.onResize( { width: this.display.size.x, height: this.display.size.y } );
    }

    stopProcess() {
        this.unsubscribe();
        this.stopComplete();
    }


    //
    // MODULES
    //

    startMainModules() {
        this.startResource();
        this.startUIStage();
        this.startStage();
        this.startInteractiveManager();
        // const screenManagerVO = new ScreenManagerVO( this.vo.screenManagerVOData );
        // this.screenManager = new ScreenManager( screenManagerVO );
        // this.screenManager.init();

    }

    startResource() {
        const resourcesVO = new ResourcesVO( this.vo.resourceVOData );
        const resources = new Resources( resourcesVO );
        resources.init();
        this.resources = resources;
    }

    startInteractiveManager() {
        // const managerVO = new InteractiveObjectVO( { application: this.application } );
        // const manager = new InteractiveManager( managerVO );
        // manager.init();
        // this.interactiveManager = manager;
    }

    startUIStage() {
        const stageVO = new StageVO( {
            engine: this,
            application: this.application,
            scene: this.display.uiscene,
            camera: this.display.uicamera
        } );
        this.uistage = new Stage( stageVO );
    }

    startStage() {
        const stageVO = new StageVO( {
            engine: this,
            application: this.application,
            scene: this.display.scene,
            camera: this.display.camera
        } );
        this.stage = new Stage( stageVO );
    }

}