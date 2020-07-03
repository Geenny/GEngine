import ModuleVO from "../../../vo/ModuleVO";

export default class WindowsVO extends ModuleVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.windowStructList = [];
        this.windowList = [];
    }

}