import VO from "../../../data/vo/VO";

export default class ApplicationVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.configPath = '';
        this.HTMLElement = null;
        this.dependencyMachineVO = null; // DependencyMachineVO instance

        this.ticker = null;
        this.timeScale = 1;
        
    }

}