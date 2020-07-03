import VO from "../../../../data/vo/VO";

export default class StepMachineVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.stepStructList = [];
        this.application = null;            // @Application
    }

}