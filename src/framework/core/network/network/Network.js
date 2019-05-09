import DependencyAbstract from "../../machines/dependency/DependencyAbstract";

export default class Network extends DependencyAbstract {

    /**
     * 
     * @param {NetworkVO} systemsVO Наследник @DependencyVO
     */
    constructor( networkVO = new NetworkVO() ) {
        super();
        this.initVO( networkVO );
    }

    //
    // GET/SET
    //

    get application() { return this.vo.application; }

    //
    // INIT
    //

    init() {
        super.init();
    }
    initVO( vo ) {
        this.vo = vo;
    }


    //
    // SYSTEMS
    //

    /**
     * 
     */
    startProcess() {
        this.startComplete();
    }

    stopProcess() {
        this.stopComplete();
    }

}