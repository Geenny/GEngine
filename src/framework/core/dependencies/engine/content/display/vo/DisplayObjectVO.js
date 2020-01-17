import VO from "../../../../../../data/vo/VO";

export default class DisplayObjectVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {

        this.enable = true;
        this.group = 0;
        this.name = "";
        this.texture = null;
        this.textureID = null;
        this.applicationTextureID = null;

    }

}