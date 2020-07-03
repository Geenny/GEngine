import VO from "../../../../data/vo/VO";

export default class StepVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.ID = 0;
        this.name = null;
        this.skip = false;
        this.isDefault = false;
        this.stepMachine = null;
        this.stepNames = [];
        this.steps = [];
    }

}