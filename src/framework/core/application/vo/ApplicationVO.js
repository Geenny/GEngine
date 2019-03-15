import VO from "../../../data/vo/VO";

export default class ApplicationVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        
        this.configPath = '';
        this.dependencyMachineVO = null;

    }

}