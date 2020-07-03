import DisplayObjectContainerVO from "../../vo/DisplayObjectContainerVO";

export default class ButtonVO extends DisplayObjectContainerVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.buttonGroup = 0;
        this.interactive = true;

        this.text = "Button";
        this.textStyleData = {};

    }

}