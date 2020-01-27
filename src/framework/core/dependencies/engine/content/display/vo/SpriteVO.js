import DisplayObjectVO from "./DisplayObjectVO";

export default class SpriteVO extends DisplayObjectVO {

    constructor( data ) {
        super( data );
    }

    init() {

        this.color = 0xff0000;
        this.fog = false;
        this.width = 100;
        this.height = 100;

    }

}