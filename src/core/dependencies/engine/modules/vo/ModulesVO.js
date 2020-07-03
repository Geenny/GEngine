import VO from "../../../../../data/vo/VO";
// import ScreenManager from "../modules/screen/ScreenManager";
// import ScreenManagerVO from "../modules/screen/vo/ScreenManagerVO";
// import Struct from "../../../../../data/content/struct/Struct";
// import Resources from "../modules/resource/Resources";
// import ResourcesVO from "../modules/resource/vo/ResourcesVO";

export default class ModulesVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.appliaction = null;
        this.moduleStructList = [ ];

    }

}