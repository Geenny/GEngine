import VO from "../../../../framework/data/vo/VO";
import UserID from "../struct/UserID";

export default class UserVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.ID = UserID.UNDEFINED;
        this.profile = null;

    }

}