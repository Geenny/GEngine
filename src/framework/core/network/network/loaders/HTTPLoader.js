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

    _requestSendProcess( request ) {
        const xhr = request.connector;

        request.state = RequestStates.SEND;
        xhr.request = request;
        xhr.responseType = this.responseType;
        xhr.open( this.method, this.url );
        // xhr.setRequestHeader("Origin", 'https://www.google.com');
        xhr.send( request.data );
    }

    requestByXHRGet( xhr ) {
        return this.queue.find( request => request.connector && request.connector === xhr );
    }

    requestComplete( request ) {
        this._requestRemoveFromSended( request );
    }

    
    //
    // CONNECTOR
    // 

    connectorGet() {
        return this._connectorCreate();
    }

    _connectorCreate() {

        const xhr = new XMLHttpRequest();
        
        xhr.addEventListener( 'loadstart', this.onInit.bind( this ) );
        xhr.addEventListener( 'progress', this.onProgress.bind( this ) );
        xhr.addEventListener( 'load', this.onComplete.bind( this ) );
        xhr.addEventListener( 'readystatechange', this.onReadyStateChange.bind( this ) );
        xhr.addEventListener( 'timeout', this.onTimeout.bind( this ) );
        xhr.addEventListener( 'abort', this.onAbort.bind( this ) );
        xhr.addEventListener( 'error', this.onError.bind( this ) );

        return xhr;
    }

    onInit( event ) {
        const request = event.currentTarget.request;
        this.onInitHandle( request );
    }
    onProgress( event ) {
        const request = event.currentTarget.request;
        this.onProgressHandle( request );
    }
    onReadyStateChange( event ) {
        // this.onCompleteHandle( event.currentTarget.request, event );
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
        const xhr = request.connector;
        request.state = RequestStates.NONE;
        this.requestComplete( request );
        this.dispatchEvent( new LoaderEvent( LoaderEvent.COMPLETE, request ) );
    }
    onErrorHandle( request ) {
        request.state = RequestStates.NONE;
        request.tries ++;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR, request ) );
        this._requestResend( request );
    }

}