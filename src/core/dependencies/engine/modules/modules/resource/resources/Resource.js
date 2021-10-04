import ResourceEvent from "../event/ResourceEvent";
import ResourceType from "../constants/ResourceType";
import LoaderEvent from "../../../../../network/loaders/events/LoaderEvent";
import Event from "../../../../../../machines/event/Event";
import Net from "../../../../../network/Net";
import LoaderAbstract from "../../../../../network/loaders/LoaderAbstract";
import ResourceState from "../states/ResourceState";
import EventDispathcer from "../../../../../../machines/event/EventDispatcher";
import Log from "../../../../../../../utils/log/Log";
import ERRORS from "../../../../../../../config/ERRORS";
import Resources from "../Resources";

export default class Resource extends EventDispathcer {

    /**
     * Обновить параметр @texture если он доступен из @resource
     * @param { String } resourceName 
     * @param { Function } callback 
     */
    static contentByNameSet( resourceName, callback ) {
        function onResourceHandle( event ) {
            const resource = event.target;
            switch ( event.type ) {
                case ResourceEvent.COMPLETE:
                    resourceContentUpdate( resource );
                    resourceUnsubscribe( resource );
                    break;
            }
        }
        function resourceContentUpdate( resource ) {
            callback( resource.content );
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
            resourceContentUpdate( resource );
        } else {
            resourceSubscribe( resource );
        }
    }

    constructor( resourceStruct ) {
        super();
        this.init( resourceStruct );
    }

    //
    // GET/SET
    //

    get ID() { return this.resourceStruct.ID; }
    set ID( value ) { this.resourceStruct.ID = value; }
    
    get name() { return this.resourceStruct.name; }
    get type() { return this.resourceStruct.type; }
    get url() { return this.resourceStruct.url; }
    get state() { return this._state; }
    get content() { return this.resourceStruct.content; }
    get progress() { return this._progress; }
    get group() { return this._group || 0; }

    //
    // INIT
    //

    init( resourceStruct ) {
        this.resourceStruct = resourceStruct;
        this._initVars();
    }

    _initVars() {
        this._state = ResourceState.NONE;
        this._progress = 0;
    }


    //
    // LOAD
    //

    load() {
        if ( this.loadStart() ) {
            this._state = ResourceState.LOADING;
            this.dispatchEvent( new ResourceEvent( ResourceEvent.LOADING, this, this.content ) );
        } else {
            this._state = ResourceState.ERROR;
            this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
        }
    }

    parseConntentByType( content ) {
        switch( this.type ) {
            case ResourceType.JSON:
                return JSON.parse( content );
            
            case ResourceType.SOUND:
            case ResourceType.UNKNOWN:
                return content;
            
            case ResourceType.FONT:
                return content;
            
            default:
                return null;
        }
    }

    destroy() {
        this._onLoaderDestroy();
    }


    //
    // LOAD
    //
    loadStart() {
        switch( this.type ) {
            case ResourceType.UNKNOWN:
            case ResourceType.JSON:
                this._loadAsDefault();
                return true;
            
            case ResourceType.FONT:
                this._loadAsFont();
                return true;
            
            case ResourceType.SOUND:
                this._loadAsSound();
                return true;
        }

        return false;
    }

    _onLoaderContentHandle() {
        if ( this.resourceStruct.onComplete == null ) return;
        this.resourceStruct.onComplete( this.resourceStruct.content );
    }

    _onLoaderComplete() {
        this._state = ResourceState.READY;
        this.destroy();
    }
    _onLoaderError() {
        this._state = ResourceState.ERROR;
    }
    _onLoaderDestroy() {
        if ( !this.loader ) return;
        if ( this.loader instanceof Audio ) {
            this.loader.removeEventListener( "canplaythrough", this._audioOnComplete );
            this.loader.removeEventListener( "progress", this._audioOnProgress );
            this.loader.removeEventListener( "error", this._audioOnError );
        } else {
            this.loader.removeEventListener( Event.ANY, this._onLoaderHandle );
        }
    }


    //
    // LOAD
    //

    /**
     * Default load
     */
    _loadAsDefault() {
        const loaderOptions = { url: this.resourceStruct.url };
        this.loader = Net.send( { }, loaderOptions );
        this.loader.addEventListener( Event.ANY, this._onLoaderHandle, this );
    }

    _onLoaderHandle( event ) {
        switch( event.type ) {
            case LoaderEvent.COMPLETE:
                this.resourceStruct.content = this.parseConntentByType( event.target.content );
                this._onLoaderContentHandle();
                this._onLoaderComplete();
                this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, this.content ) );
                break;
            case LoaderEvent.PROGRESS:
                this._progress = event.target.request.loaded / event.target.request.total;
                break;
            case LoaderEvent.ERROR:
                this._onLoaderError();
                this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
                break;
        }
    }

    /**
     * Font load
     * https://stackoverflow.com/questions/11355147/font-face-changing-via-javascript
     */
    _loadAsFont() {

        this._fontOnComplete = this._fontOnComplete.bind( this );

        //
        //
        //
        var newStyle = document.createElement( 'style' );
        var textNode = document.createTextNode( "@font-face { font-family: " + this.resourceStruct.name + "; src: url('" + this.resourceStruct.url + "'); }" );
        newStyle.appendChild( textNode );
        document.head.appendChild( newStyle );

        const span = document.createElement( 'span' );
        let initElementWidth = 0, iteration = 180;
        span.style.fontFamily = 'sans-serif'; // this.resourceStruct.name;
        // span.style.fontFamily    = 'sans-serif';
        span.style.display = "absolute";
        span.style.visibility = "hidden";
        span.style.fontSize = '150px';
        span.style.fontVariant   = 'normal';
        span.style.fontStyle     = 'normal';
        span.style.fontWeight    = 'normal';
        span.style.letterSpacing = '0';
        span.textContent = "ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123457890@!?.";

        if ( span.style.fontFamily === "" ) {
            Log.error(  ERRORS.E3001, this.resourceStruct.name );
            this._fontOnComplete();
            return;
        }

        document.body.appendChild( span );
        initElementWidth = span.getBoundingClientRect().width;
        span.style.fontFamily = this.resourceStruct.name + ', sans-serif';

        const intervalIndex = setInterval( () => {
            iteration--;
            if ( span.getBoundingClientRect().width === initElementWidth && iteration > 0 ) return;
            clearInterval( intervalIndex );
            document.body.removeChild( span );
            this._fontOnComplete();
        }, 100 );
    }
    _fontOnComplete() {
        this._progress = 1;
        this.resourceStruct.content = true;
        this._onLoaderComplete();
        this._onLoaderContentHandle();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, this.content ) );
    }
    _fontOnError( event ) {
        this._onLoaderError();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
    }


    /**
     * Audio load
     */
    _loadAsSound() {
        const audio = new Audio( );
        this.loader = audio;

        this._audioOnComplete = this._audioOnComplete.bind( this );
        this._audioOnProgress = this._audioOnProgress.bind( this );
        this._audioOnError = this._audioOnError.bind( this );

        audio.addEventListener( "canplaythrough", this._audioOnComplete );
        audio.addEventListener( "progress", this._audioOnProgress );
        audio.addEventListener( "error", this._audioOnError );
        audio.src = this.resourceStruct.url;
    }
    _audioOnComplete( event ) {
        this._progress = 1;
        this.resourceStruct.content = event.target;
        this._onLoaderComplete();
        this._onLoaderContentHandle();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this, this.content ) );
    }
    _audioOnProgress( event ) {
        this._progress = 0;
    }
    _audioOnError( event ) {
        this._onLoaderError();
        this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this, this.content ) );
    }


    destroy() {
        if ( !this.loader ) return;

        if ( this.loader instanceof Audio ) {
            this.loader.removeEventListener( "canplaythrough", this._audioOnComplete );
            this.loader.removeEventListener( "progress", this._audioOnProgress );
            this.loader.removeEventListener( "error", this._audioOnError );
        } else if ( this.loader instanceof LoaderAbstract ) {
            this.loader.removeEventListener( Event.ANY, this._onLoaderHandle, this );
        }

        this.loader = null;
        
    }

}