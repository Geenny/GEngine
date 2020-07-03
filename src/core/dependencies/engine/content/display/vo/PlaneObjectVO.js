import DisplayObjectVO from "./DisplayObjectVO";
import Point from "../../../../../../data/content/graphics/Point";
import SpriteVO from "./SpriteVO";

export default class PlaneObjectVO extends SpriteVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.segmentWidth = 4;
        this.segmentHeight = 4;

    }

}