import LoaderAbstract from "./LoaderAbstract";
import LoaderEvent from "./events/LoaderEvent";
import NetworkHTTPMethod from "../constants/NetworkHTTPMethod";
import HTTPRequestResponseType from "../constants/HTTPRequestResponseType";
import RequestStates from "./states/RequestStates";
import ObjectUtils from "../../../../utils/tech/ObjectUtils";

export default class LoaderHTTP extends LoaderAbstract {

    constructor() {
        super();
    }


    //
    // SET/GET
    //

    get method() { return this.serverStruct.method || NetworkHTTPMethod.GET; }
    get responseType() { return this.serverStruct.responseType || HTTPRequestResponseType.TEXT; }

    get proxy() { return this.serverStruct.proxy; }


    //
    // INIT
    //

    init( serverStruct ) {
        super.init( serverStruct );
    }

    initVars() {
        super.initVars();
    }

    //
    // DATA
    //

    optionsUpdate( options ) {
        super.optionsUpdate( options );
        this.serverStruct.responseType = options.responseType || this.serverStruct.responseType;
        this.randomValue = options.randomValue || 0;
    }


    //
    // REQUEST
    //

    requestIsCompleteReady( request ) {
        if ( !request || !request.connector ) return false;
        return request.connector.status != 404;
    }

    _requestComplete( request ) {
        this._content = request.connector.response;
        request.content = request.connector.response;
    }

    _requestDestroy( request ) {
        const xhr = request.connector;
        const handlers = xhr.handlers;

        for ( const handlerName in handlers ) {
            xhr.removeEventListener( handlerName, handlers[ handlerName ] );
        }

        request.reset();
    }

    _requestSendProcess( request ) {
        const xhr = request.connector;
        request.state = RequestStates.SEND;
        xhr.request = request;
        xhr.responseType = this.responseType;

        if ( this.proxy ) {
            this._xhrSend( xhr, this.proxy, this.method, {
                curl: this.url,
                ...request.params
            } );
        } else {
            this._xhrSend( xhr, this.url, this.method, request.params );
        }
    }
    _xhrSend( xhr, url, method, params ) {
        if ( method === NetworkHTTPMethod.GET ) {
            xhr.open( method, url + this.formatParams( params ) );
            xhr.send();
        } else if ( method === NetworkHTTPMethod.POST ) {
            xhr.open( method, url );
            xhr.send( formDataGet( params ) );
        }
    }

    formDataGet( params = {} ) {
        const form = new FormData();
        for ( const key in params ) {
            form.append( kwy, params[ key ] );
        }
        return form;
    }

    formatParams( params ) {
        if ( this.randomValue ) {
            if ( !params ) params = { };
            params.r = this.randomValue;
        }
        if ( ObjectUtils.noData( params ) ) return "";
        return "?" + Object.keys( params )
            .map( function( key ) {
                return key + "=" + encodeURIComponent( params[ key ] )
            } )
            .join("&");
    }

    
    //
    // CONNECTOR
    // 

    connectorGet() {
        return this._connectorCreate();
    }

    _connectorCreate() {

        const xhr = new XMLHttpRequest();

        const handlers = {
            loadstart: this.onInit.bind( this ),
            progress: this.onProgress.bind( this ),
            load: this.onComplete.bind( this ),
            timeout: this.onTimeout.bind( this ),
            abort: this.onAbort.bind( this ),
            error: this.onError.bind( this ),
        };
        
        xhr.addEventListener( 'loadstart', handlers.loadstart );
        xhr.addEventListener( 'progress', handlers.progress );
        xhr.addEventListener( 'load', handlers.load );
        xhr.addEventListener( 'timeout', handlers.timeout );
        xhr.addEventListener( 'abort', handlers.abort );
        xhr.addEventListener( 'error', handlers.error );
        xhr.handlers = handlers;

        return xhr;
    }

    onInit( event ) {
        const request = event.currentTarget.request;
        this.onInitHandle( event.currentTarget.request );
    }
    onProgress( event ) {
        const request = event.currentTarget.request;
        request.loaded = event.loaded;
        request.total = event.total;
        this.onProgressHandle( event.currentTarget.request );
    }
    onReadyStateChange( event ) {
        // 
    }
    onComplete( event ) {
        this.onCompleteHandle( event.currentTarget.request, event );
    }
    onTimeout( event ) {
        this.onErrorHandle( event.currentTarget.request );
    }
    onAbort( event ) {
        this.onErrorHandle( event.currentTarget.request );
    }
    onError( event ) {
        this.onErrorHandle( event.currentTarget.request );
    }


    //
    // HANDLERS
    //

    onInitHandle( request ) {
        request.state = RequestStates.PENDING;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.INIT, request ) );
    }
    onProgressHandle( request ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.PROGRESS, request ) );
    }
    onCompleteHandle( request ) {
        request.state = RequestStates.COMPLETE;
        this._requestComplete( request );
        if ( this.requestIsCompleteReady( request ) ) {
            this.dispatchEvent( new LoaderEvent( LoaderEvent.COMPLETE, request ) );
        } else {
            this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR, request ) );
        }
        this._requestDestroy( request );
    }
    onErrorHandle( request ) {
        request.state = RequestStates.NONE;
        request.tries ++;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR, request ) );
        this._requestResend( request );
    }

}