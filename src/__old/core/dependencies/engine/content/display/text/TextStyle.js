import VO from "../../../../../../data/vo/VO";

export default class TextStyle extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {

        super.initVars();

        this.size = 26;
        this.font = "Arial";
        this.fill = "#ff0000";
        this.lineHeight = 0;
        this.lineDistance = 10,
        this.offset = 0;
        this.wordWrapWidth = 0;
        this.textAlign = "start";           // start, end, left, right or center
        this.textBaseline = "alphabetic";   // top, hanging, middle, alphabetic, ideographic, bottom
        this.direction = "inherit";         // ltr, rtl, inherit

        this.stroke = false;
        this.strokeStyle = "#ffffff";
        this.strokeLineWidth = 1;

        this.shadow = false;
        this.shadowBlur = 0;
        this.shadowOffsetX = 5;
        this.shadowOffsetY = 5;
        this.shadowColor = "#000000";

        this.backgroundStyle = "#ffffff";

    }

}