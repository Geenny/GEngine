import VO from "../../../../../data/vo/VO";

export default class ModulesVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.appliaction = null;
        this.applicationRootName = "modules";
        this.moduleStructList = [ ];

    }

}