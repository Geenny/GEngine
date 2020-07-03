import SpriteWrapper from "./SpriteWrapper";
import NodeFillType from "../constants/NodeFillType";

export default class SpriteBound extends SpriteWrapper {
    
    constructor( texture ) {
        super( texture );
    }


    //
    // GET/SET
    //
    get fill() { return this._fill; }
    set fill( value ) {
        if ( this._fill === value ) return;
        this._fill = value;
        this.fillUpdate();
    }
    
    get parameters() { return this._parameters; }
    set parameters( value ) {
        super.parameters = value;
        if ( this._parameters.fill ) {
            this.fill = this._parameters.fill || NodeFillType.NONE;
        }
    }


    //
    // RESIZE
    //
    resize( size ) {
        super.resize( size );
        this.fillUpdate();
    }


    //
    // RESOURCE
    //
    textureSet( texture ) {
        this.texture = texture;
        this.fillUpdate();
    }


    //
    // FILL
    // 
    fillUpdate() {
        if ( !this.size ) return;
        switch( this.fill ) {
            case NodeFillType.LANDSCAPE:
                this.width = this.size.x;
                break;
            case NodeFillType.PORTRAIT:
                this.height = this.size.y;
                break;
            case NodeFillType.FULL:
                this.width = this.size.x;
                this.height = this.size.y;
                break;

            case NodeFillType.LANDSCAPE_LOCK_RESOLUTION:
                this.width = this.size.x;
                this.scale.y = this.scale.x;
                break;
            case NodeFillType.PORTRAIT_LOCK_RESOLUTION:
                this.height = this.size.y;
                this.scale.x = this.scale.y;
                break;
            case NodeFillType.FULL_LOCK_RESOLUTION:
                this.width = this.size.x;
                this.scale.y = this.scale.x;
                if ( this.height < this.size.y ) {
                    this.height = this.size.y;
                    this.scale.x = this.scale.y;
                }
                break;

            case NodeFillType.LANDSCAPE_IN_LOCK_RESOLUTION:
                this.width = this.size.x;
                this.scale.y = this.scale.x;
                break;
            case NodeFillType.PORTRAIT_IN_LOCK_RESOLUTION:
                this.height = this.size.y;
                this.scale.x = this.scale.y;
                break;
            case NodeFillType.FULL_IN_LOCK_RESOLUTION:
                if ( this.size.x < this.width / this.scale.x ) {
                    this.width = this.size.x;
                    this.scale.y = this.scale.x;
                } else if ( this.size.y < this.height / this.scale.y ) {
                    this.height = this.size.y;
                    this.scale.x = this.scale.y;
                }
                break;
        }
    }

}