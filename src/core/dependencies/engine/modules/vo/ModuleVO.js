import VO from "../../../../../data/vo/VO";

export default class ModuleVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.ID = 0;
        this.name = null;
        this.modules = null;
        this.appliaction = null;

    }

}