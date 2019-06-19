import StateMachine from "../../../machines/state/StateMachine";
import StateMachineVO from "../../../machines/state/vo/StateMachineVO";
import LoaderStates from "./states/LoaderStates";
import RequestLoader from "./RequestLoader";
import EventDispathcer from "../../../machines/event/EventDispatcher";
import LoaderEvent from "./events/LoaderEvent";

export default class AbstractLoader extends EventDispathcer {

    constructor() {
        super();
        this.initVars();
    }


    //
    // GET/SET
    //

    get type() { return this.serverStruct.type || null; }

    get state() { return this.sm.state; }
    set state( value ) { this.sm.stateSet( value ); }

    get sendable() {
        return !this.requestQueueLimit && 
            this.state !== LoaderStates.FULL &&
            this.state !== LoaderStates.ERROR &&
            this.state !== LoaderStates.DISCONNECTED;
    }

    get server() { return this._server; }

    get requestQueueLimit() { return this.requestQueueCount <= 0 ||
        this._sended.length >= this.requestQueueCount }

    get queue() { return this._queue; }

    get requestQueueCount() { return this.serverStruct.requestQueueCount; }
    set requestQueueCount( value ) { this.serverStruct.requestQueueCount = value; }


    //
    // INIT
    //

    init( serverStruct ) {
        this.initStateMachine();
        this.initServerStruct( serverStruct );
    }

    initVars() {
        this._queue = [];
        this._sended = [];
    }

    initStateMachine() {
        const stateMachineVO = new StateMachineVO( this.stateMachineData );
        this.sm = new StateMachine( stateMachineVO );
    }

    initServerStruct( serverStruct ) {
        this.serverStruct = serverStruct;
        this._server = this.serverStruct.server || this.serverStruct.servers[0];
    }

    //
    // SEND
    //

    /**
     * Отправка запроса
     * @param {object} data 
     */
    send( params ) {
        this._sendProcess( this.sendDataParse( params ) );
    }

    sendDataParse( params ) { return params; }

    _sendProcess( params ) {
        this.state = LoaderStates.WORKING;
        this._requestCreate( params );
        this._sendQueueHandle();
    }

    _sendQueueHandle() {
        if ( !this.sendable ) return;
        if ( !this.queue.length ) return;
        this._requestSend( this.queue.shift() );
    }



    //
    // REQUEST
    //

    _requestCreate( params ) {
        const request = new RequestLoader( params );
        return this._requestAdd( request );
    }

    _requestSend( request ) {
        if ( this._sended.indexOf( request) >= 0 ) return;
        this._requestToSend( request );
        this._requestConnectorAdd( request );
        this._requestSendProcess( request );
    }

    _requestResend( request ) {
        this._requestRemoveFromSended( request );
        if ( this._requestResendCheck( request ) ) {
            this._queue.unshift( request );
        } else {
            this._requestDestroy();
        }
        this._sendQueueHandle();
    }

    _requestResendCheck( request ) {
        return !this.serverStruct.requestTries ||
            ( this.serverStruct.requestTries > 0 && request.tries < this.serverStruct.requestTries );
    }

    _requestRemoveFromSended( request ) {
        const index = this._sended.indexOf( request );
        if ( index >= 0 ) {
            this._sended.splice( index, 1 );
            return true;
        }
        return false;
    }

    /**
     * Отправка запроса через @connector
     * @param {*} request 
     */
    _requestSendProcess( request ) {
        // SEND
    }

    _requestAdd( request ) {
        this._queue.push( request );
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ADD, request ) );
        return request;
    }

    _requestToSend( request ) {
        this._sended.push( request );
        this.dispatchEvent( new LoaderEvent( LoaderEvent.TO_SEND, request ) );
        return request;
    }
    
    _requestConnectorAdd( request ) {
        request.connector = this.connectorGet();
    }



    //
    // CONNECTOR
    //

    /**
     * Коннектор отравки/загрузки данных
     */
    connectorGet() { return null; }


    //
    // TEST
    //

    test() {}


}