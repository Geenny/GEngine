import Systems from "../systems/systems/Systems";
import EventDispathcer from "../machines/event/EventDispatcher";
import ApplicationEvent from "./event/ApplicationEvent";
import ApplicationVO from "./vo/ApplicationVO";
import ApplicationView from "./ApplicationView";
import Log from "../../utils/log/Log";
import Launcher from "../launcher/Launcher";
import DependencyMachine from "../machines/dependency/DependencyMachine";
import DependencyMachineVO from "../machines/dependency/vo/DependencyMachineVO";
import DependencyAbstract from "../machines/dependency/DependencyAbstract";
import DependencyVO from "../machines/dependency/vo/DependencyVO";
import DependencyStruct from "../machines/dependency/struct/DependencyStruct";
import Event from "../machines/event/Event";
import DependencyMachineEvent from "../machines/dependency/events/DependencyMachineEvent";

export default class Application extends EventDispathcer {

    /**
     * 
     * @param {HTMLElement} element 
     * @param {ApplicationVO} vo 
     */
    constructor( HTMLElement, vo = new ApplicationVO() ) {

        super();

        this.setHTMLElement( HTMLElement );
        this.setVO( vo );

        Log.l("Application Started!!!");

    }


    //
    // GET/SET
    //

    
    //
    // INIT
    //

    init() {
        this.initDependencyMachine();
    }

    initDependencyMachine() {
        const dependencyMachineVO = this.dependencyMachineVOGet();
        const dependencyMachine = new DependencyMachine( dependencyMachineVO );
        dependencyMachine.addEventListener( Event.ANY, this.onDependencyMachineEvent, this );
        dependencyMachine.init();

        this.dependencyMachine = dependencyMachine;
    }
    onDependencyMachineEvent( event ) {
        const dependency = event.dependency;
        if ( dependency ) {
            if ( dependency instanceof Systems ) {
                this.systems = dependency;
            }
        }
        this.dispatchEvent( new DependencyMachineEvent( event.type, event.dependencyMachine, event.dependency ) );
    }

    dependencyMachineVOGet( data = {} ) {

        // const dependency1 = {
        //     ... DependencyStruct,
        //     ID: 1,
        //     name: "a",
        //     class: DependencyAbstract,
        //     options: { dependenceNameList: ["d"] }
        // }
        // const dependency2 = {
        //     ... DependencyStruct,
        //     ID: 2,
        //     name: "b",
        //     class: DependencyAbstract,
        //     options: { dependenceNameList: ["a"] }
        // }
        // const dependency3 = {
        //     ... DependencyStruct,
        //     ID: 3,
        //     name: "c",
        //     class: DependencyAbstract,
        //     options: { dependenceNameList: ["a","b"] }
        // }
        // const dependency4 = {
        //     ... DependencyStruct,
        //     ID: 4,
        //     name: "d",
        //     class: DependencyAbstract,
        //     options: { dependenceNameList: [] }
        // }

        // data = {
        //     dependencyStructList: [
        //         dependency1,
        //         dependency2,
        //         dependency3,
        //         dependency4
        //     ]
        // }

        let dependencyMachineVO = null;

        if ( this.vo.dependencyMachineVO instanceof DependencyMachineVO ) {
            dependencyMachineVO = this.vo.dependencyMachineVO;
        } else if ( this.vo.dependencyMachineVO ) {
            dependencyMachineVO = new DependencyMachineVO( this.vo.dependencyMachineVO );
        } else {
            dependencyMachineVO = new DependencyMachineVO( data );
        }

        dependencyMachineVO.application = this;

        return dependencyMachineVO;
    }

    // initSystems() {
    //     this.
    // }


    //
    // VO
    //

    setVO( vo ) {
        this.vo = vo;
    }

    setHTMLElement( HTMLElement ) {
        this.applicationView = new ApplicationView( HTMLElement );
        // applicationView.addEventListener(  )
    } 

}