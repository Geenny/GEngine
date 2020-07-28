import PlaneObject from "../PlaneObject";
import ResourceGenerator from "../../../resource/ResourceGenerator";
import { TextGeometry, Geometry, Vector3, Face3, Font, ShapeBufferGeometry, Shape, MeshBasicMaterial, MeshPhongMaterial, DoubleSide, Mesh, FrontSide, CanvasTexture } from "three";
import ResourceStruct from "../../../resource/struct/ResourceStruct";
import ResourceType from "../../../resource/enum/ResourceType";
import Resources from "../../../resource/Resources";
import StringUtils from "../../../../../../utils/tech/StringUtils";
import TextStyle from "./TextStyle";

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

    get text() { return this.vo.text ? this.vo.text : ""; }
    set text( value ) {
        this.vo.text = value;
        this.textUpdate();
    }

    get textStyle() { return this._textStyle; }
    set textStyle( value ) {
        if ( !( value instanceof TextStyle) ) return;
        this._textStyle = value;
        this.textUpdate();
    }

    get generation() { return this.vo.generation; }

    get defaultShape() {
        const x = 200, y = 0;
        const shape = new Shape();
        shape.moveTo( x + 25, y + 25 );
        shape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
        shape.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 );
        shape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
        shape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
        shape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
        shape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );
        return shape;
    }


    //
    // INIT
    //

    init() {
        this._initTextFieldVars();
        this._initTextStyle();
        super.init();
    }

    _initTextFieldVars() {
        this._text = this.vo.text;
    }

    _initTextStyle() {
        this._textStyle = new TextStyle( this.vo.textStyleData );
    }

    _initTexture() {
        this.textUpdate();
    }

    // materialUpdate() {
    //     if ( !this._object3D ) return;
    //     if ( this._material.map === this.texture ) return;
    //     // this._material.map = this.texture;
    //     // this._material.needsUpdate = true;
    // }
    
    // materialCreate() {
    //     return new MeshPhongMaterial( { color: 0xffff00, side: FrontSide } );
    // }


    //
    // TEXT
    //

    textUpdate() {
        const texture = this._generateTexture(); 
        this.textureSet( texture );
    }

    geometryCreate() {
        if ( this.generation ) {
            // const geometryData = {
            //     font: {},
            //     size: this.vo.size,
            //     height: this.vo.height,
            //     curveSegments: this.vo.curveSegments };
            // return new TextGeometry( this._text, geometryData );

            // const geometry = new Geometry();
            // geometry.vertices.push(
            //     new Vector3( -10,  10, 0 ),
            //     new Vector3( -10, -10, 0 ),
            //     new Vector3(  10, -10, 0 )
            // );
            // geometry.faces.push( new Face3( 0, 1, 2 ) );

            //debugger;
            //const font = new Font( {} );

            return new ShapeBufferGeometry( this.defaultShape );
        }

        return super.geometryCreate();
    }

    fontGet() {
        const resourceStruct = { ...ResourceStruct };
        resourceStruct.textureName = "helvetiker_regular";
        resourceStruct.type = ResourceType.JSON;
        resourceStruct.onComplete = this.fontComplete.bind( this );

        Resources.resourceGet( resourceStruct );
    }

    fontComplete( fontJson ) {
        this.fontUpdateByJSON( fontJson );
    }

    fontUpdateByJSON( fontJson ) {
        this.font = new Font( fontJson );
        const shapes = this.font.generateShapes( this.text, 20 );

        // const mesh = new Mesh( new ShapeBufferGeometry( shapes ), this._material );
    }



    _generateTexture() {
        let _width = 0, _height = 0, _lines = [], _textFieldWidth = 0, _textFieldHeight = 0, _lineHeight = 0;
        const CANVAS_NAME = "canvas", CONTENT_TYPE = "2d";

        let canvas = document.createElement( CANVAS_NAME );
        canvas.width = 16;
        canvas.height = 16;

        let context = canvas.getContext( CONTENT_TYPE );
        context.font = `${this.textStyle.size}px ${this.textStyle.font}`;
        context.fillStyle = this.textStyle.fill;
        context.textBaseline = this.textStyle.textBaseline;
        context.direction = this.textStyle.direction;

        _lines = StringUtils.wordWrapLines( context, this.text, this.textStyle.wordWrapWidth );

        for ( let i = 0; i < _lines.length; i++ ) {
            const measure = context.measureText( _lines[i] );
            _width = measure.width > _width ? measure.width : _width;
            _lineHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent > _lineHeight ?
                measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent : _lineHeight;
        }

        _lineHeight += this.textStyle.lineHeight || 0;
        _textFieldWidth = _width + this.textStyle.offset * 2;
        _textFieldHeight = _lineHeight * _lines.length + this.textStyle.lineDistance * (_lines.length > 0 ? _lines.length - 1 : 0);
        _width = Math.pow(2, Math.floor(Math.log2(_textFieldWidth)) + 1);
        _height = Math.pow(2, Math.floor(Math.log2(_textFieldHeight)) + 1);

        canvas = document.createElement( CANVAS_NAME );
        canvas.width = _width;
        canvas.height = _height;

        context = canvas.getContext( CONTENT_TYPE );

        if ( this.debug ) {
            context.beginPath();
            context.rect( 0, 0, _width, _height );
            context.fillStyle = this.textStyle.backgroundStyle;
            context.fill();
        }

        context.font = `${this.textStyle.size}px ${this.textStyle.font}`;
        context.fillStyle = this.textStyle.fill;
        context.textBaseline = this.textStyle.textBaseline;
        context.direction = this.textStyle.direction;

        for ( let i = 0; i < _lines.length; i++ ) {
            const lineWidthStart = this.textStyle.offset;
            const lineHeightStart = _lineHeight * (i + 1) + this.textStyle.lineDistance * i;
            context.fillText( _lines[i], lineWidthStart, lineHeightStart );

            if ( this.textStyle.stroke ) {
                context.strokeStyle = this.textStyle.strokeStyle;
                context.lineWidth = this.textStyle.strokeLineWidth;
                context.strokeText( _lines[i], lineWidthStart, lineHeightStart );
            }

            if ( this.textStyle.shadow ) {
                context.shadowBlur = this.textStyle.shadowBlur;
                context.shadowOffsetX = this.textStyle.shadowOffsetX;
                context.shadowOffsetY = this.textStyle.shadowOffsetY;
                context.shadowColor = this.textStyle.shadowColor;
            }
        }

        return new CanvasTexture( canvas );
    }

}