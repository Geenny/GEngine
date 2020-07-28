import { Texture, Text, Point } from "pixi.js";
import SpriteWrapper from "./SpriteWrapper";
import { BUTTON_DEFAULT, BUTTON_OVER, BUTTON_PRESS, BUTTON_DISABLE } from "../../../../../../../../constants/ButtonState";
import MethodUtils from "../../../../../../../../utils/tech/MethodUtils";
import { Tween } from "@createjs/tweenjs";
import Sounds from "../../../sound/Sounds";
import ContainerWrapper from "./ContainerWrapper";

const BUTTON_SOUND_OVER = "ButtonSoundClick";
const BUTTON_SOUND_CLICK = "ButtonSoundClick";

export default class ButtonWrapper extends ContainerWrapper {
    
    /**
     * Текстурыможно задать по массиву из 4х элементов @textures в @parameters
     * @param { Texture } texture 
     */
    constructor( parameters = {} ) {
        super();

        this.subscribe();
        this.createContainers();
        this.update();

        this.interactive  = true;
        this.parameters = parameters;
    }


    //
    // GET/SET
    //
    get enable() { return this._enable === undefined ? true : this._enable; }
    set enable( value ) {
        if ( value === this.enable ) return;
        this._enable = value;
        this.update();
    }

    get state() { return this._state || BUTTON_DEFAULT; }
    set state( value ) { 
        if ( value === this.state ) return;
        this._state = value;
        this.update();
    }

    get anchor() {
        if ( typeof this._anchor === "number" )
            return new Point( this._anchor, this._anchor );
        return this._anchor || new Point( 0.5, 0.5 );
    }
    set anchor( value ) {
        this._anchor = value;
        this._textAnchorUpdate();
        this._buttonAnchorUpdate();
    }

    get parameters() { return this._parameters; }
    set parameters( value ) {
        this._parameters = value || {};
        if ( this._parameters.hasOwnProperty( "interactive" ) ) this.interactive = this._parameters.interactive;
        this.anchor = this._parameters.anchor || 0.5;
        this._scaleSet( this._parameters.scales );
        this._textSet( this._parameters.text, this._parameters.textStyle );
        this._texturesSet();
    }

    get texture() { return this.button ? this.button.texture : null; }
    set texture( value ) {
        if ( !( value instanceof Texture ) ) return;
        if ( !this.button ) return;
        this.button.texture = value;
    }

    get textureDefault() { return this._textureDefault; }
    set textureDefault( value ) { this._textureDefault = value; }
    get textureOver() { return this._textureOver; }
    get texturePress() { return this._texturePress; }
    get textureDisable() { return this._textureDisable; }

    get text() { return this._text; }
    set text( value )  {
        if ( value === this._text ) return;
        this._text = value;
        this._textUpdate();
    }

    get textStyle() { return this._textStyle; }



    //
    // CREATE
    //

    createContainers() {

        this.container = new ContainerWrapper();
        this.addChild( this.container );

        this.button = new SpriteWrapper();
        this.container.addChild( this.button );
        this._buttonAnchorUpdate();

    }
    _buttonAnchorUpdate() {
        if ( !this.button ) return;
        this.button.anchor = this.anchor;
    }


    //
    // UPDATE
    //

    update() {
        if ( !this.enable ) {
            this.texture = this._textureDisable;
            this.container.alpha = 0.5;
            return;
        }
        
        switch( this.state ) {
            case BUTTON_DEFAULT:
                this.texture = this._textureDefault;
                this.scaleSet( 0 );
                break;

            case BUTTON_OVER:
                this.texture = this._textureOver;
                this.scaleSet( 1 );
                break;

            case BUTTON_PRESS:
                this.texture = this._texturePress;
                this.scaleSet( 2 );
                break;

            case BUTTON_DISABLE:
                this.texture = this._textureDisable;
                this.scaleSet( 3 );
                break;
        }
    }

    scaleSet( scaleIndex ) {
        this._scale = scaleIndex > 0 && this._scales.length > scaleIndex ? this._scales[ scaleIndex ] : 1;
    }
    scaleTween() {
        if ( typeof this._scale != "number" ) return;
        Tween.get( this.container.scale )
            .to( { x: this._scale, y: this._scale }, 50 );
    }
    scaleTweenClear() {
        Tween.removeTweens( this.container.scale );
    }




    //
    // RESOURCE
    //
    _texturesSet(  ) {
        if ( this.parameters.textures ) {
            this._texturesFromArray( this.parameters.textures );
        } else {
            this._texturesFromValues(
                this.parameters.textureDefault,
                this.parameters.textureOver,
                this.parameters.texturePress,
                this.parameters.textureDisable
            );
        }
    }
    _texturesFromArray( textures ) {
        if ( !Array.isArray( textures ) ) return;
        this._texturesFromValues( textures[0], textures[1], textures[2], textures[3] );
    }
    _texturesFromValues( defaultT, overT, pressT, disableT ) {
        let textureDefaultCallback = function( texture ) { this._textureDefault = texture; }
        let textureOverCallback = function( texture ) { this._textureOver = texture; }
        let texturePressCallback = function( texture ) { this._texturePress = texture; }
        let textureDisableCallback = function( texture ) { this._textureDisable = texture; }

        textureDefaultCallback = textureDefaultCallback.bind( this );
        textureOverCallback = textureOverCallback.bind( this );
        texturePressCallback = texturePressCallback.bind( this );
        textureDisableCallback = textureDisableCallback.bind( this );

        this.button.resourceTextureUpdate( defaultT, textureDefaultCallback, true );
        this.button.resourceTextureUpdate( overT ? overT : defaultT, textureOverCallback );
        this.button.resourceTextureUpdate( pressT ? pressT : defaultT, texturePressCallback );
        this.button.resourceTextureUpdate( disableT ? disableT : defaultT, textureDisableCallback );
    }
    _scaleSet( scales ) {
        this._scales = Array.isArray( scales ) ? scales : [];
    }
    _textSet( value, style ) {
        this._text = value || null;
        this._textStyle = style || { };
        this._textUpdate();
    }
    _textUpdate() {
        if ( !this.textField ) {
            this._textCreate();
        } else {
            this.textField.text = this._text;
        }
    }
    _textCreate() {
        this.textField = new Text( this._text, this._textStyle );
        this.container.addChild( this.textField );
        this._textAnchorUpdate();
    }
    _textAnchorUpdate() {
        if ( !this.textField ) return;
        this.textField.anchor = this.anchor;
    }


    //
    // LISTENERS
    //

    subscribe() {
        if ( this._subscribed ) return;
        this._subscribed = true;

        this.onTap = this.onTap.bind( this );
        this.onDown = this.onDown.bind( this );
        this.onUp = this.onUp.bind( this );
        this.onUpOutside = this.onUpOutside.bind( this );
        this.onOver = this.onOver.bind( this );
        this.onOut = this.onOut.bind( this );
        this.onCancel = this.onCancel.bind( this );
        this.onMove = this.onMove.bind( this );

        this.on( "pointertap", this.onTap );
        this.on( "pointerdown", this.onDown );
        this.on( "pointerup", this.onUp );
        this.on( "pointerupoutside", this.onUpOutside );
        this.on( "pointerover", this.onOver );
        this.on( "pointerout", this.onOut );
        this.on( "pointercancel", this.onCancel );
        this.on( "pointermove", this.onMove );
    }
    unsubscribe() {
        if ( !this._subscribed ) return;
        this._subscribed = false;

        this.off( "pointertap", this.onTap );
        this.off( "pointerdown", this.onDown );
        this.off( "pointerup", this.onUp );
        this.off( "pointerupoutside", this.onUpOutside );
        this.off( "pointerover", this.onOver );
        this.off( "pointerout", this.onOut );
        this.off( "pointercancel", this.onCancel );
        this.off( "pointermove", this.onMove );
    }

    onTap( event ) {
        if ( MethodUtils.isMethod( this.parameters.onTap ) ) this.parameters.onTap( event );
        Sounds.play( BUTTON_SOUND_CLICK, { start: 0, volume: 0.1 } );
    }
    onDown( event ) {
        this.state = BUTTON_PRESS;
        this.scaleTween();
        if ( MethodUtils.isMethod( this.parameters.onDown ) ) this.parameters.onDown( event );
    }
    onUp( event ) {
        this.state = BUTTON_OVER;
        this.scaleTween();
        if ( MethodUtils.isMethod( this.parameters.onUp ) ) this.parameters.onUp( event );
    }
    onUpOutside( event ) {
        this.state = BUTTON_DEFAULT;
        this.scaleTween();
    }
    onOver( event ) {
        this.state = BUTTON_OVER;
        this.scaleTween();
        Sounds.play( BUTTON_SOUND_OVER, { start: 0, volume: 0.03 } );
    }
    onOut( event ) {
        this.state = BUTTON_DEFAULT;
        this.scaleTween();
    }
    onCancel( event ) {
        this.state = BUTTON_DEFAULT;
        this.scaleTween();
    }
    onMove( event ) {
        if ( MethodUtils.isMethod( this.parameters.onMove ) ) this.parameters.onMove( event );
    }


    //
    // DESTROY
    //

    destroy() {
        this.unsubscribe();
    }

}
