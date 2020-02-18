import DisplayObjectVO from "./DisplayObjectVO";

export default class InteractiveObjectVO extends DisplayObjectVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.interactive = false;
        this.hitBox = null;

    }

}