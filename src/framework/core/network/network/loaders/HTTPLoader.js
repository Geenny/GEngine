import AbstractLoader from "./AbstractLoader";
import LoaderEvent from "./events/LoaderEvent";

export default class HTTPLoader extends AbstractLoader {

    constructor() {
        super();
    }


    //
    // SET/GET
    //

    set requestQueueCount( value ) {
        if ( this.requestQueueCount === value ) return;
        this.serverStruct.requestQueueCount = value;
        this.connectorListCreate()
    }


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
        // TODO
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
        debugger;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.INIT ) );
    }
    onProgress( event ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.PROGRESS ) );
    }
    onReadyStateChange( event ) {
        debugger;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.PROGRESS ) );
    }
    onTimeout( event ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR ) );
    }
    onAbort( event ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR ) );
    }
    onError( event ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR ) );
    }

}