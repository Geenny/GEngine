import VO from "../../../../../../data/vo/VO";
import { FrontSide } from "three";

export default class DisplayObjectVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        this.enable = true;
        this.group = 0;
        this.name = "";
        this.texture = null;
        this.textureID = null;
        this.textureName = null;
        this.applicationTextureID = null;

        this.materialData = {
            map: null,
            color: null, // 0xffffff
            fog: false,
            wireframe: false,
            transparent: true,
            side: FrontSide
        };

    }

}