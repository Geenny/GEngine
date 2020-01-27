import { EventDispatcher, Texture, CanvasTexture, TextureLoader } from "three";
import ResourceEvent from "./event/ResourceEvent";
import ResourceType from "./enum/ResourceType";
import LoaderEvent from "../../network/loaders/events/LoaderEvent";
import Event from "../../../machines/event/Event";
import Net from "../../network/Net";

export default class Resource extends EventDispatcher {

    constructor( resourceStruct ) {
        super();
        this.init( resourceStruct );
    }

    //
    // GET/SET
    //

    get name() { return this.resourceStruct.name; }

    get type() { return this.resourceStruct.type; }

    get content() { return this.resourceStruct.content; }

    get state() { return this._state; }

    get progress() { return this._progress; }

    //
    // INIT
    //

    init( resourceStruct ) {
        this.resourceStruct = resourceStruct;
        this._initVars();
    }

    _initVars() {
        this._state = ResourceEvent.NONE;
    }


    //
    // LOAD
    //

    load() {
        if ( this._loadStart() ) {
            this._state = ResourceEvent.LOADING;
            this.dispatchEvent( new ResourceEvent( ResourceEvent.LOADING, this, this.content ) );
        } else {
            this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
        }
    }

    parseConntentByType( content ) {
        switch( this.type ) {
            case ResourceType.JSON:
                return JSON.parse( content );
            
            case ResourceType.IMAGE:
                return content;

            case ResourceType.TEXTURE:
                return content;
            
            default:
                return content;
        }
    }

    destroy() {
        this._onLoaderDestroy();
    }


    //
    // LOAD
    //
    _loadStart() {
        switch( this.type ) {
            case ResourceType.JSON:
            case ResourceType.IMAGE:
                this._loadAsJson();
                return true;
            
            case ResourceType.TEXTURE:
                this._loadAsTexture();
                return true;
        }

        return false;
    }

    _onLoaderHandle( event ) {
        switch( event.type ) {
            case LoaderEvent.COMPLETE:
                this.resourceStruct.content = this.parseConntentByType( event.target.content );
                this._onLoaderContentHandle();
                this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, this.content ) );
                break;
            case LoaderEvent.PROGRESS:
                this._progress = event.target.request.loaded / event.target.request.total;
                break;
        }
    }

    _onLoaderContentHandle() {
        if ( this.resourceStruct.onComplete != null ) {
            this.resourceStruct.onComplete( this.resourceStruct.content );
        }
    }

    _onLoaderComplete() {
        this._state = ResourceEvent.COMPLETE;
        this._destroy();
    }


    //
    // JSON
    //

    _loadAsJson() {
        const loaderOptions = { url: this.resourceStruct.url };
        this.loader = Net.send( {}, loaderOptions );
        this.loader.addEventListener( Event.ANY, this._onLoaderHandle, this );
    }


    //
    // TEXTURE
    //

    _loadAsTexture() {
        // const loaderOptions = { url: this.resourceStruct.url };
        // this.loader = Net.send( {}, loaderOptions );
        // this.loader.addEventListener( Event.ANY, this._onLoaderHandle, this );
        const texture = new TextureLoader().load(
            this.resourceStruct.url,
            ( texture ) => {
                this._onLoaderHandle( { type: LoaderEvent.COMPLETE, target: { content: texture } } );
            }
        );
    }

    _destroy() {
        if ( !this.loader ) return;
        this.loader.removeEventListener( Event.ANY, this._onLoaderHandle, this );
    }

}