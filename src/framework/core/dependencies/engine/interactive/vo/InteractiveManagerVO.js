import VO from "../../../../framework/data/vo/VO";

export default class InteractiveManagerVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {

        super.init();

        this.ID = UserID.UNDEFINED;
        this.profile = null;

    }

}