import DisplayVO from "../../../vo/DisplayVO";
import DisplayType from "../../../constants/DisplayType";

export default class PixiJSDisplayVO extends DisplayVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.type = DisplayType.PIXI;
        this.pixiOptions = {
            antialias: true,
            backgroundColor: 0x000000
        }
        
    }

}