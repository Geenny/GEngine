import PlaneObjectVO from "../../vo/PlaneObjectVO";

export default class TextFieldVO extends PlaneObjectVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.generation = false;
        this.text = "";
        this.css = "";

        this.textStyleData = {};

    }

}