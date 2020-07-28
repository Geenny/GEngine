import StateMachine from "../../../machines/state/StateMachine";
import StateMachineVO from "../../../machines/state/vo/StateMachineVO";
import LoaderStates from "./states/LoaderStates";
import RequestLoader from "./RequestLoader";
import EventDispathcer from "../../../machines/event/EventDispatcher";
import LoaderEvent from "./events/LoaderEvent";
import RequestStates from "./states/RequestStates";

export default class AbstractLoader extends EventDispathcer {

    constructor() {
        super();
    }


    //
    // GET/SET
    //

    /**
     * Возвращает экземпляр @RequestLoader
     */
    get request() { return this._request; }

    get type() { return this.serverStruct.type || null; }

    get state() { return this.sm.state ? this.sm.state.name : RequestStates.COMPLETE; }
    set state( value ) { this.sm.stateSet( value ); }

    get sendable() {
        return this.request && this.state === RequestStates.NONE;
    }

    get url() { return this._url; }

    get content() { return this._content; }


    //
    // INIT
    //

    init( serverStruct ) {
        this.initStateMachine();
        this.initServerStruct( serverStruct );
    }

    initStateMachine() {
        const stateMachineVOData = {
            states: { ...RequestStates }
        };
        const stateMachineVO = new StateMachineVO( stateMachineVOData );
        this.sm = new StateMachine( stateMachineVO );
        this.state = RequestStates.NONE;
    }

    initServerStruct( serverStruct ) {
        this.serverStruct = serverStruct;
        this._url = this.serverStruct.url || this.serverStruct.urls[0];
    }

    //
    // DATA
    //

    optionsUpdate( options ) {
        this._url = options.url || this._url;
    }


    //
    // SEND
    //

    /**
     * Отправка запроса
     * @param { Object } data 
     */
    send( data ) {
        this._send( this.sendDataParse( data ) );
    }

    sendDataParse( data ) { return data; }

    requestDestroy() { }

    _send( data ) {
        this.state = LoaderStates.WORKING;
        this._requestCreate( data );
        this._sendProcess();
    }

    _sendProcess() {
        if ( !this.sendable ) return;
        this._requestSend();
    }



    //
    // REQUEST
    //

    _requestCreate( params ) {
        const connector = this.connectorGet();
        const request = new RequestLoader( params, connector );
        return this._requestAdd( request );
    }

    _requestSend() {
        this._requestToSend();
        this._requestSendProcess( this.request );
    }

    _requestResend( request ) {
        if ( !this._requestResendCheck( request ) ) {
            this.requestDestroy();
        } else {
            this._sendProcess();
        }
    }

    _requestResendCheck( request ) {
        return !this.serverStruct.requestTries ||
            ( this.serverStruct.requestTries > 0 && request.tries < this.serverStruct.requestTries );
    }

    /**
     * Отправка запроса через @connector
     * @param {*} request 
     */
    _requestSendProcess( request ) {
        // SEND
    }

    _requestAdd( request ) {
        this._request = request;
        this.dispatchEvent( new LoaderEvent( LoaderEvent.ADD, request ) );
        return request;
    }

    _requestToSend() {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.TO_SEND, this.request ) );
    }

    _requestDestroy( request ) {
        this.dispatchEvent( new LoaderEvent( LoaderEvent.CANCEL, request ) );
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

    /**
     * Удаление коннектор. Уничтожение его ссылочной информации
     */
    connectorDestroy() { }


    //
    // TEST
    //

    test() {}


}