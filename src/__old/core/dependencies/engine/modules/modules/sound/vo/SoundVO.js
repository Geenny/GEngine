import ModuleVO from "../../../vo/ModuleVO";

export default class SoundVO extends ModuleVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.ID = 0;
        this.name = null;
        this.audio = null;

        this.mute = false;
        this.volume = 1;
        this.start = 0.1;
        this.loop = false;
        this.multi = true;
        
    }

}