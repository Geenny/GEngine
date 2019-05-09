import DependencyAbstract from "../../machines/dependency/DependencyAbstract";

export default class Network extends DependencyAbstract {

    /**
     * 
     * @param {NetworkVO} networkVO Наследник @DependencyVO
     */
    constructor( networkVO = new NetworkVO() ) {
        super();
        this.initVO( networkVO );
        this.initVars();
    }

    //
    // GET/SET
    //

    get servers() { return this._servers; }

    get application() { return this.vo.application; }

    //
    // INIT
    //

    init() {
        super.init();
        this.initServers();
    }
    initVO( vo ) {
        this.vo = vo;
    }
    initVars() {

    }
    initServers() {
        debugger;
    }


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