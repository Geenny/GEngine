import Point from "../../../../../../data/content/graphics/Point";
import DisplayObjectVO from "./DisplayObjectVO";

export default class SpriteVO extends DisplayObjectVO {

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