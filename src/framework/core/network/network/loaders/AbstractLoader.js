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
    send( data ) {
        if ( !this.sendable ) return;
        this.sendProcess( this.sendDataParse( data ) );
    }

    sendProcess( data ) {
        this.state = LoaderStates.WORKING;
        this.requestCreate( data );
        this.sendQueueHandle();
    }

    sendDataParse( data ) { return data; }

    sendQueueHandle() {
        if ( !this.sendable ) return;
        if ( !this.queue.length ) return;
        this.requestSend( this.queue.shift() );
    }



    //
    // REQUEST
    //

    requestCreate( data ) {
        const request = new RequestLoader( data );
        return this.requestAdd( request );
    }

    requestSend( request ) {
        if ( this._sended.indexOf( request) >= 0 ) return;
        this._requestToSend( request );
        this._requestConnectorAdd( request );
        this.requestSendProcess( request );
    }

    /**
     * Отправка запроса через @connector
     * @param {*} request 
     */
    requestSendProcess( request ) {
        this.onError( request );
    }

    requestAdd( request ) {
        this._queue.push( request );
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ADD, request ) );
        return request;
    }

    onResponse( request ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.COMPLETE, request ) );
    }
    onError( request ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ERROR, request ) );
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