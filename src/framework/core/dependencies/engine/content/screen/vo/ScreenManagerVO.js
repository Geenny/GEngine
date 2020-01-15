import VO from "../../../../../../data/vo/VO";

export default class ScreenManagerVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.screenCurrent = null;
        this.screenList = [];
        this.screenHistory = [];
    }

}