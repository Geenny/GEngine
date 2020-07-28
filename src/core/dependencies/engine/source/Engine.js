import DependencyAbstract from "../../../machines/dependency/DependencyAbstract";
import EngineVO from "./vo/EngineVO";
import ResizeEvent from "../../systems/display/ResizeEvent";
import Modules from "../modules/Modules";
import ModulesVO from "../modules/vo/ModulesVO";

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

    get width() { return this.size.x; }
    get height() { return this.size.y; }
    // get startUIX() { return Math.floor( this.display.size.x * 0.5 ); }
    // get startUIY() { return -Math.floor( this.display.size.y * 0.5 ); }


    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
        this.subscribe();
        this.modulesCreate();
    }
    _initVars() { }
    
    // SUBSCRIBE
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
        this.size = event.size;
        if ( !this.modules ) return;
        this.modules.resize( this.size );
        
        // if ( this.stage ) {
        //     this.stage.width = event.width;
        //     this.stage.height = event.height;
        //     this.stage.resize();
        // }

        // if ( this.uistage ) {
        //     this.uistage.width = event.width;
        //     this.uistage.height = event.height;
        //     this.uistage.resize();
        // }
    }


    //
    // DEPENDENCY
    //

    /**
     * 
     */
    startProcess() {
        this.modulesStart();
        this.onResize( { size: this.display.size } );
        this.startComplete();
    }

    stopProcess() {
        this.unsubscribe();
        this.stopComplete();
    }


    //
    // MODULES
    //

    modulesStart() {
        if ( !this.modules ) return;
        this.modules.moduleStartAll();
    }

    modulesCreate() {
        const modulesVOData = { ...this.vo.modulesVOData, application: this.application };
        const modulesVO = new ModulesVO( modulesVOData );
        const modules = new Modules( modulesVO );
        modules.init();
        this.modules = modules;
    }

    // startMainModules() {
        // this.startResource();
        // this.startUIStage();
        // this.startStage();
        // this.startInteractiveManager();
    // }

    // startResource() {
    //     const resourcesVO = new ResourcesVO( this.vo.resourceVOData );
    //     const resources = new Resources( resourcesVO );
    //     resources.init();
    //     this.resources = resources;
    // }

    // startInteractiveManager() {
        // const managerVO = new InteractiveObjectVO( { application: this.application } );
        // const manager = new InteractiveManager( managerVO );
        // manager.init();
        // this.interactiveManager = manager;
    // }

    // startUIStage() {
    //     const stageVO = new StageVO( {
    //         engine: this,
    //         application: this.application,
    //         scene: this.display.uiscene,
    //         camera: this.display.uicamera
    //     } );
    //     this.uistage = new Stage( stageVO );
    // }

    // startStage() {
    //     const stageVO = new StageVO( {
    //         engine: this,
    //         application: this.application,
    //         scene: this.display.scene,
    //         camera: this.display.camera
    //     } );
    //     this.stage = new Stage( stageVO );
    // }

}