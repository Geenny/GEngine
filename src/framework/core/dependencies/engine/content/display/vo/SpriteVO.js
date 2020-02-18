import Point from "../../../../../../data/content/graphics/Point";
import InteractiveObjectVO from "./InteractiveObjectVO";

export default class SpriteVO extends InteractiveObjectVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.width = 256;
        this.height = 256;
        this.scale = new Point(1, 1);
        this.rotation = 0;
    }

}