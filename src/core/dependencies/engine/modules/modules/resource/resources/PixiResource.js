import Resource from "./Resource";
import ResourceEnum from "../enum/ResourceEnum";
import { Loader, Texture } from "pixi.js";
import ResourceEvent from "../event/ResourceEvent";
import Resources from "../Resources";

export default class PixiResource extends Resource {

    /**
     * Обновить параметр @texture если он доступен из @resource
     * @param { String } resourceName 
     * @param { Function } callback 
     */
    static textureByNameSet( resourceName, callback ) {
        function onResourceHandle( event ) {
            const resource = event.target;
            switch ( event.type ) {
                case ResourceEvent.COMPLETE:
                    resourceTextureUpdate( resource );
                    resourceUnsubscribe( resource );
                    break;
            }
        }
        function resourceTextureUpdate( resource ) {
            callback( resource.content.texture );
        }
        function resourceSubscribe( resource ) {
            resource.addEventListener( ResourceEvent.ANY, onResourceHandle );
        }
        function resourceUnsubscribe( resource ) {
            resource.removeEventListener( ResourceEvent.ANY, onResourceHandle );
        }

        const resource = Resources.resourceGetByName( resourceName );
        if ( !resource ) return;
        if ( resource.content ) {
            resourceTextureUpdate( resource );
        } else {
            resourceSubscribe( resource );
        }
    }

    constructor( resourceStruct ) {
        super( resourceStruct );
    }

    loadStart() {
        const loadStartResult = super.loadStart();
        if ( loadStartResult ) return loadStartResult;
        switch( this.type ) {
            case ResourceEnum.IMAGE:
            //case ResourceEnum.FONT:
                this._loadAsTexture();
                return true;
        }

        return false;
    }

    parseConntentByType( content ) {
        let resultContent = super.parseConntentByType( content );
        if ( resultContent ) return resultContent;

        switch( content ) {
            case ResourceEnum.IMAGE:
            //case ResourceEnum.FONT:
                return content;

            default:
                return null;
        }
    }


    //
    // LOAD
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