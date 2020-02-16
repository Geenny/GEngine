import PlaneObjectVO from "../../vo/PlaneObjectVO";

export default class TextFieldVO extends PlaneObjectVO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.text = "";
        this.css = "";

        this.size = 50;
        this.color = 0xF045A7;

    }

}