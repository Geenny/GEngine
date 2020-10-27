import Resource from "./Resource";
import ResourceType from "../constants/ResourceType";
import PixiResourceType from "../constants/PixiResourceType";
import { Loader } from "pixi.js";
import ResourceEvent from "../event/ResourceEvent";

export default class PixiResource extends Resource {

    /**
     * 
     * @param { Object } resourceStruct Объект ресурсов
     */
    constructor( resourceStruct ) {
        super( resourceStruct );
    }

    loadStart() {
        const loadStartResult = super.loadStart();
        if ( loadStartResult ) return loadStartResult;
        switch( this.type ) {
            case ResourceType.IMAGE:
            case PixiResourceType.TEXTURE:
            //case ResourceType.FONT:
                this._loadAsTexture();
                return true;
        }

        return false;
    }

    parseConntentByType( content ) {
        let resultContent = super.parseConntentByType( content );
        if ( resultContent ) return resultContent;

        switch( content ) {
            case ResourceType.IMAGE:
            case PixiResourceType.TEXTURE:
            //case ResourceType.FONT:
                return content;

            default:
                return null;
        }
    }


    //
    // LOAD
    //

    //
    // TEXTURE LOADER
    //
    _loadAsTexture() {
        const loader = new Loader();
        loader.add( this.resourceStruct.url );

        this._textureOnComplete = this._textureOnComplete.bind( this );
        this._textureOnProgress = this._textureOnProgress.bind( this );
        this._textureOnError = this._textureOnError.bind( this );

        loader.onComplete.add( this._textureOnComplete );
        loader.onProgress.add( this._textureOnProgress );
        loader.onError.add( this._textureOnError );

        this.loader = loader;

        loader.load();
    }
    _textureOnComplete( event ) {
        this._progress = event.progress / 100;
        
        const content = this.loader.resources[ this.resourceStruct.url ];

        this.resourceStruct.content = content;
        this._onLoaderComplete();
        this._onLoaderContentHandle();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, this.content ) );
    }
    _textureOnProgress( event ) {
        this._progress = event.progress / 100;
    }
    _textureOnError( event ) {
        this._onLoaderError();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
    }

    
    //
    // DESTROY
    //
    destroy() {
        super.destroy();

        if ( !this.loader ) return;

        if ( this.loader instanceof Loader ) {
            this.loader.destroy();
        }
    }

}