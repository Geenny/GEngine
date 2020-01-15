import VO from "../../../../framework/data/vo/VO";

export default class InteractiveObjectVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {

        this.enable = true;
        this.group = 0;
        this.interactionID = 0;
        // this.texture = null;
        // this.textureID = null;
        // this.applicationTextureID = null;

    }

}