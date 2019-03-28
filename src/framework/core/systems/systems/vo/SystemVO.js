import VO from "../../../../data/vo/VO";

export default class SystemVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.target = null;
    }

}