import VO from "../../../../../data/vo/VO";

export default class InteractiveManagerVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.appliaction = null;
        this.scene = null;
        this.camera = null;

    }

}