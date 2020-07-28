import DisplayObjectContainer from "../DisplayObjectContainer";
import ButtonVO from "./vo/ButtonVO";
import DisplayObjectContainerVO from "../vo/DisplayObjectContainerVO";
import TextFieldVO from "../text/vo/TextFieldVO";
import TextField from "../text/TextField";
import PlaneObject from "../PlaneObject";
import PlaneObjectVO from "../vo/PlaneObjectVO";

export default class Button extends DisplayObjectContainer {

    /**
     * 
     * @param { ButtonVO } buttonVO
     */
    constructor( buttonVO ) {
        super( buttonVO );
    }

    //
    // GET/SET
    //

    get buttonGroup() { return this.vo.buttonGroup; }
    set buttonGroup( value ) { this.vo.buttonGroup = value; }

    get text() { return this.vo.text; }
    set text( value ) {
        this.vo.text = value;
        this.draw();
    }

    get textStyle() { return this.textField ? this.textField.textStyle : this.vo.textStyle; }
    set textStyle( value ) {
        this.vo.textStyle = value;
        this.draw();
    }


    //
    // INIT
    //

    init() {
        super.init();
        this._initButtonVars();
        this.draw();
    }

    _initButtonVars() {}


    //
    // DRAW
    //

    draw() {
        this.removeChildren();

        const backgroundVOData = { textureName: "ButtonInputAtlas" };
        const backgroundVO = new PlaneObjectVO( backgroundVOData );
        const background = new PlaneObject( backgroundVO );
        this.addChild( background );
        this.background = background;

        const textFieldVOData = { text: this.text, textStyleData: this.vo.textStyleData };
        const textFieldVO = new TextFieldVO( textFieldVOData );
        const textField = new TextField( textFieldVO );
        this.addChild( textField );
        this.textField = textField;
    }

}