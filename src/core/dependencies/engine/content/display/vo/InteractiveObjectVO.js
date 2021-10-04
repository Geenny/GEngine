import VO from "../../../../../../data/vo/VO";

export default class InteractiveObjectVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.interactive = false;
        this.buttonMode = true;
        this.hitBox = null;

    }

}