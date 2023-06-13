import VO from "../../../../../../../data/vo/VO";

export default class ScreenVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.layer = 0;
        this.popup = false;
        this.screenManager = null;
        this.screenData = {};
    }

}