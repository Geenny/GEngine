import DependencyVO from "../../../machines/dependency/vo/DependencyVO";
import Point from "../../../../data/content/graphics/Point";

export default class DisplayVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    init() {

        super.init();

        this.ID = -1;
        this.name = null;
        this.canvas = null;
        this.size = new Point();

    }

}