import ModuleVO from "../../../vo/ModuleVO";

export default class ScreenBuilderVO extends ModuleVO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.appliaction = null;
    }

}