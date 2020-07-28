import ModuleVO from "../../../vo/ModuleVO";

export default class SoundsVO extends ModuleVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.mute = false;
        this.volume = 1;

    }

}