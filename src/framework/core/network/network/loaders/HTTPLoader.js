import AbstractLoader from "./AbstractLoader";
import LoaderEvent from "./events/LoaderEvent";
import NetworkHTTPMethod from "../constants/NetworkHTTPMethod";
import HTTPRequestResponseType from "../constants/HTTPRequestResponseType";

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
        this.connectorListCreate()
    }

    get url() { return this.server; }
    get method() { return this.serverStruct.method || NetworkHTTPMethod.GET; }
    get responseType() {
        return this.serverStruct.responseType || HTTPRequestResponseType.TEXT;
    }

    get proxy() { return this.serverStruct.proxy; }


    //
    // INIT
    //

    init( serverStruct ) {
        super.init( serverStruct );
        this.connectorListCreate();
    }

    initVars() {
        super.initVars();
        this.connectors = [];
    }


    //
    // REQUEST
    //

    requestSendProcess( request ) {
        const connector = request.connector;
        const xhr = connector.xhr;

        connector.ready = true;
        xhr.request = request;
        xhr.responseType = this.responseType;
        // xhr.open( this.method, this.url );
        xhr.open( this.method, `https://cors-anywhere.herokuapp.com/${this.url}/@shalvah/posts`);
        // xhr.setRequestHeader("Origin", 'maximum.blog');
        xhr.send( request.data );
    }

    requestByXHRGet( xhr ) {
        return this.queue.find( request => request.connector && request.connector.xhr === xhr );
    }

    
    //
    // CONNECTOR
    // 

    connectorGet() {
        return this.connectors.find( object => object.ready === true );
    }

    connectorListCreate() {
        if ( this.requestQueueCount < 0 ) return;
        if ( this.requestQueueCount < this.connectors.length ) {
            this.connectors = this.connectors.slice( 0, this.requestQueueCount );
        } else {
            while ( this.connectors.length < this.requestQueueCount ) {
                const connectorStruct = this.connectorCreate();
                this.connectors.push( connectorStruct );
            }
        }
    }

    connectorCreate() {

        const xhr = new XMLHttpRequest();
        xhr.addEventListener( 'loadstart', this.onInit.bind( this ) );
        xhr.addEventListener( 'progress', this.onProgress.bind( this ) );
        xhr.addEventListener( 'readystatechange', this.onReadyStateChange.bind( this ) );
        xhr.addEventListener( 'timeout', this.onTimeout.bind( this ) );
        xhr.addEventListener( 'abort', this.onAbort.bind( this ) );
        xhr.addEventListener( 'error', this.onError.bind( this ) );

        return { xhr, ready: true };
    }

    onInit( event ) {
        const request = event.currentTarget.request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.INIT ), request, event );
    }
    onProgress( event ) {
        const request = event.currentTarget.request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.PROGRESS ), request, event );
    }
    onReadyStateChange( event ) {
        const request = event.currentTarget.request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.COMPLETE ), request, event );
    }
    onTimeout( event ) {
        const request = event.currentTarget.request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR ), request, event );
    }
    onAbort( event ) {
        const request = event.currentTarget.request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR ), request, event );
    }
    onError( event ) {
        const request = event.currentTarget.request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR ), request, event );
    }

}