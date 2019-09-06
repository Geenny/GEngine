import AbstractLoader from "./AbstractLoader";
import LoaderEvent from "./events/LoaderEvent";
import NetworkHTTPMethod from "../constants/NetworkHTTPMethod";
import HTTPRequestResponseType from "../constants/HTTPRequestResponseType";
import RequestStates from "./states/RequestStates";

export default class HTTPLoader extends AbstractLoader {

    constructor() {
        super();
    }


    //
    // SET/GET
    //

    get requestQueueCount() { return this.serverStruct.requestQueueCount; }
    set requestQueueCount( value ) {
        if ( this.requestQueueCount === value ) return;
        this.serverStruct.requestQueueCount = value;
    }

    get url() { return this.server; }
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
        this.connectors = [];
    }


    //
    // REQUEST
    //

    _requestComplete( request ) {
        request.data = request.connector.response;
        this._requestRemoveFromSended( request );
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
            this._xhrSend( xhr, this.proxy, this.method, request.params );
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
        return "?" + Object.keys(params)
            .map(function(key){
                return key + "=" + encodeURIComponent(params[key])
            })
            .join("&")
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
            // readystatechange: this.onReadyStateChange.bind( this ),
            timeout: this.onTimeout.bind( this ),
            abort: this.onAbort.bind( this ),
            error: this.onError.bind( this ),
        }
        
        xhr.addEventListener( 'loadstart', handlers.loadstart );
        xhr.addEventListener( 'progress', handlers.progress );
        xhr.addEventListener( 'load', handlers.load );
        // xhr.addEventListener( 'readystatechange', readystatechange );
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
        request.state = RequestStates.NONE;
        this._requestComplete( request );
        this.dispatchEvent( new LoaderEvent( LoaderEvent.COMPLETE, request ) );
        this._requestDestroy( request );
        this._sendQueueHandle();
    }
    onErrorHandle( request ) {
        request.state = RequestStates.NONE;
        request.tries ++;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR, request ) );
        this._requestResend( request );
    }

}