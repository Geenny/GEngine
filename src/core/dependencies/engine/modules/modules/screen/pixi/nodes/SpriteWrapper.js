import { Sprite, Texture } from "pixi.js";
import PixiResource from "../../../resource/resources/PixiResource";

export default class SpriteWrapper extends Sprite {
    
    constructor( parameters = {} ) {
        super();
        this.parameters = parameters;
    }


    //
    // GET/SET
    //
    get enable() { return this._enable === undefined ? true : this._enable; }
    set enable( value ) {
        if ( value === this.enable ) return;
        this._enable = value;
    }

    get resourceName() { return this._resourceName; }
    set resourceName( value ) {
        if ( value && this.resourceName === value ) return;
        this._resourceName = value;
        this.resourceUpdate();
    }

    get resource() { return this._resource; }
    
    get parameters() { return this._parameters; }
    set parameters( value ) {
        this._parameters = value || {};
        if ( this._parameters.resourceName ) {
            this.resourceName = this._parameters.resourceName;
        }
    }


    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
    }


    //
    // RESOURCE
    //
    resourceUpdate() {
        // const resourceStruct = { target: this.texture, value: this.resourceName, isMain: true };
        this.resourceTextureUpdate( this.resourceName, null, true );
    }
    textureSet( texture ) {
        this.texture = texture;
    }

    /**
     * Шаблонное обновление текстуры
     * @param { Object } resourceStruct Объект { target, value }
     */
    resourceTextureUpdate( value, callback, isMain = false ) {
        const textureSet = this.textureSet.bind( this );

        function update( texture ) {
            if ( callback ) callback( texture );
            if ( isMain ) textureSet( texture );
        }

        if ( value instanceof Texture ) {
            update( value );
        } else if ( typeof value === "string" ) {
            PixiResource.textureByNameSet( value, update );
        }
    }

}