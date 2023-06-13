import InteractiveObjectVO from "./InteractiveObjectVO";

export default class DisplayObjectContainerVO extends InteractiveObjectVO {

    constructor( data ) {
        super( data );

        this.enable = true;
        this.name = "";
    }

}