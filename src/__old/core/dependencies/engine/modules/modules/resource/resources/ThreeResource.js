import Resource from "./Resource";
import ResourceEvent from "../event/ResourceEvent";
import ThreeResourceType from "../constants/ThreeResourceType";
import { FBXLoader } from "../../../../../../../../node_modules/three/examples/jsm/loaders/FBXLoader";
import { FontLoader } from "three";

export default class ThreeResource extends Resource {

    constructor( resourceStruct ) {
        super( resourceStruct );
    }

    loadStart() {
        const loadStartResult = super.loadStart();
        if ( loadStartResult ) return loadStartResult;
        switch( this.type ) {
            case ThreeResourceType.TYPEFACE:
                this._loadAsThreeTypefaceFont();

            case ThreeResourceType.FBX:
                this._loadAsThreeFBX();
                return true;
        }

        return false;
    }

    parseConntentByType( content ) {
        let resultContent = super.parseConntentByType( content );
        if ( resultContent ) return resultContent;

        switch( content ) {
            case ThreeResourceType.TYPEFACE:
            case ThreeResourceType.FBX:
                return content;

            default:
                return null;
        }
    }


    //
    // LOAD
    //

    _loadAsThreeFBX() {
        const loader = new FBXLoader();

        this._fbxOnComplete = this._fbxOnComplete.bind( this );
        this._fbxOnProgress = this._fbxOnProgress.bind( this );
        this._fbxOnError = this._fbxOnError.bind( this );

        this.loader = loader;

        loader.load( this.resourceStruct.url, this._fbxOnComplete, this._fbxOnProgress, this._fbxOnError );
    }
    _fbxOnComplete( content ) {
        this._progress = 1;

        this.resourceStruct.content = content;
        this._onLoaderComplete();
        this._onLoaderContentHandle();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, content ) );
    }
    _fbxOnProgress( event ) {
        this._progress = event.loaded / event.total || 0;
    }
    _fbxOnError( event ) {
        debugger;
        this._onLoaderError();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
    }


    _loadAsThreeTypefaceFont() {
        const loader = new FontLoader();

        this.loader = loader;

        this._typefaceFontOnComplete = this._typefaceFontOnComplete.bind( this );
        this._typefaceFontOnProgress = this._typefaceFontOnProgress.bind( this );
        this._typefaceFontOnError = this._typefaceFontOnError.bind( this );

        loader.load( this.resourceStruct.url, this._textureOnComplete, this._textureOnProgress, this._textureOnError );
    }
    _typefaceFontOnComplete( content ) {
        this._progress = 1;

        this.resourceStruct.content = content;
        this._onLoaderComplete();
        this._onLoaderContentHandle();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, content ) );
    }
    _typefaceFontOnProgress( event ) {
        this._progress = event.loaded / event.total || 0;
    }
    _typefaceFontOnError( event ) {
        debugger;
        this._onLoaderError();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
    }


    //
    // DESTROY
    //
    destroy() {
        super.destroy();

        if ( !this.loader ) return;

        if ( this.loader instanceof FBXLoader ) {
            this.loader.destroy();
        }
    }

}