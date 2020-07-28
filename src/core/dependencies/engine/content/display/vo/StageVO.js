import VO from "../../../../../../data/vo/VO";

export default class StageVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.enable = true;
        this.group = 0;
        this.engine = null;
    }

}