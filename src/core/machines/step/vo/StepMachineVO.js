import VO from "../../../../data/vo/VO";

export default class StepMachineVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.steps = [];                    // { name, step: StepClass, list: [ ... ] }
        this.stepStructList = [];
        this.application = null;            // @Application
    }

}