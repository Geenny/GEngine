import VO from "../../../../../../../data/vo/VO";

export default class WindowVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.ID = 0;
        this.name = null;
        this.unique = false;
        this.popup = false;
        this.windows = null;

        this.windowStruct = null;
        this.content = null;

    }

}