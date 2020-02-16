import PlaneObject from "../PlaneObject";
import ResourceGenerator from "../../../resource/ResourceGenerator";

export default class TextField extends PlaneObject {

    /**
     * 
     * @param { TextFieldVO } textFieldVO
     */
    constructor( textFieldVO ) {
        super( textFieldVO );
    }

    //
    // GET/SET
    //

    get text() { return this._text; }
    set text( value ) {
        this._text = value;
        this.textUpdate();
    }


    //
    // INIT
    //

    init() {
        this._initTextFieldVars();
        super.init();
    }

    _initTextFieldVars() {
        this._text = this.vo.text;
    }

    _initTexture() {
        this.textUpdate();
    }


    //
    // TEXT
    //

    textUpdate() {
        const texture = ResourceGenerator.getText( this._text );
        this.textureSet( texture );
    }

}