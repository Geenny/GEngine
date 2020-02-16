import VO from "../../../../../../data/vo/VO";

export default class DisplayObjectContainerVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.enable = true;
        this.name = "";

    }

}