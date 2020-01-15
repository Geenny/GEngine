import VO from "../../../../../../data/vo/VO";

export default class ScreenVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.screenBuilderList = [];
    }

}