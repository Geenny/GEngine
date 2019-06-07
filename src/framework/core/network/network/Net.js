import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import ServerStruct from "./struct/ServerStruct";
import ObjectUtils from "../../../utils/tech/ObjectUtils";
import AbstractSender from "./senders/AbstractSender";
import Log from "../../../utils/log/Log";
import DependencyStates from "../../machines/dependency/states/DependencyState";
import NetworkSenderType from "./constants/NetworkSenderType";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
import ContentMapper from "../../../data/content/ContentMapper";
import HTTPSender from "./senders/HTTPSender";
import ConnectionSender from "./senders/ConnectionSender";

export default class Net extends DependencyAbstract {

    static send( data, options = null ) {
        return Net.instance.send( data, options );
    }

    /**
     * 
     * @param {NetVO} netVO Наследник @DependencyVO
     */
    constructor( netVO = new NetVO() ) {
        super();
        this.initVO( netVO );
    }

    //
    // GET/SET
    //

    get servers() { return this._servers; }

    get application() { return this.vo.application; }

    get senderMapper() { return this._sendersMapper; }

    //
    // INIT
    //

    init() {
        super.init();
        this.initVars();
        this.initContentMappers();
        this.initServers();
        // this.initSenders();
        Net.instance = this;
    }

    /**
     * Назначение NetVO. Происходит один раз из конструктора класса.
     * @param {NetVO} vo 
     */
    initVO( vo ) { this.vo = vo; }
    initVars() {
        this._servers = [];
        this._senders = [];
        this._sendersMapper = {};
    }
    initContentMappers() {
        const mapper = { };
        mapper[ NetworkSenderType.HTTP ] = HTTPSender;
        mapper[ NetworkSenderType.CONNECTION ] = ConnectionSender;
        this._sendersMapper = new ContentMapper( { ...mapper, ...this.vo.sendersMapper } );
    }


    /**
     * Dependency start
     */
    startProcess() {
        this.startComplete();
    }

    /**
     * Dependency stop
     */
    stopProcess() {
        this.stopComplete();
    }


    //
    // SEND
    //

    send( data, options = null ) {
        if ( this.state !== DependencyStates.WORKING ) return;
        const serverStruct = this.serverStructGet( options );
        return serverStruct.sender ? sender.send( data ) : null;
    }


    //
    // SERVER
    //

    /**
     * Инициализация серверов для связи приложения
     */
    initServers() {
        if (this.vo.serverList) {
            for ( let i = 0; i < this.vo.serverList.length; i++ ) {
                const serverData = this.vo.serverList[ i ];
                this.serverAddBySourceData( serverData );
            }
        }
    }

    /**
     * Добавить сервер по исходным данным. Если данных не будет достаточно
     * сервер не будет создан
     * @param {*} serverData 
     */
    serverAddBySourceData( serverData = {} ) {
        const serverStruct = this._createServerStruct( serverData );
        if ( this._serverDataCheck( serverData ) ) {
            serverStruct.sender = this.findServerSender( serverStruct );
            serverStruct.ID = ArrayUtils.getUniqueNumericValue( "ID", this._servers );

            this._serverStructAdd( serverStruct );
        }
    }

    /**
     * Возвращает сервер по его @name или @ID или по типу его @sender
     * Если не один из параметров не удовлетворяет поиски, возвращается
     * сервер по умолчанию с @HTTPSender .
     * @param {*} options 
     */
    serverStructGet( options = {} ) {
        let http = null;
        for ( let i = 0; i < this._servers.length; i++ ) {
            const server = this._servers[ i ];
            if ( !http && server.sender && server.sender.type === NetworkSenderType.HTTP ) {
                http = server;
            }
            if ( options.ID && server.ID === options.ID )
                return server;
            if ( options.name && server.name === options.name )
                return server;
            if ( options.type && server.sender && server.sender.type === options.type )
                return server;
        }
        return http;
    }

    _serverDataCheck( serverData ) {
        return serverData && 
            !this._servers.find(struct => struct.name === serverData.name);
    }
    _serverStructAdd( serverStruct ) {
        this._servers.push( serverStruct );
    }
    _createServerStruct( sourceData ) {
        return ObjectUtils.assignExists( { ... ServerStruct }, sourceData );
    }


    //
    // SENDER
    //

    /**
     * Определить является ли @AbstractSender посыльным для данного @Net
     * @param { AbstractSender } sender 
     */
    inSender( sender ) { return this._senders.indexOf( sender ) !== -1; }

    /**
     * Определить является ли @AbstractSender по его типу посыльным для данного @Net
     * @param {string} senderType 
     */
    inSenderByType( senderType ) {
        return this.inSender( this.senderByTypeGet( senderType ) )
    }

    /**
     * 
     * @param { ServerStruct } serverStruct 
     */
    findServerSender( serverStruct ) {
        const sender = this._findSenderFromExists( serverStruct );
        return sender || this._senderCreate( serverStruct );
    }

    /**
     * Вернуть @AbstractSender по его типу
     * @param { string } senderType 
     */
    senderByTypeGet( senderType ) {
        return ArrayUtils.findAsObject( this._senders, "type", senderType );
    }

    /**
     * 
     * @param { AbstractSender } senderClass 
     */
    senderByClassGet( senderClass ) {
        return ArrayUtils.findAsObject( this._senders, "senderClass", senderClass );
    }

    /**
     * Вернуть класс сендера по его @senderType из @senderMapper
     * @param { string } senderType 
     */
    _senderClassByTypeGet( senderType ) {
        return this.senderMapper.get( senderType );
    }

    _senderCreate( serverStruct ) {
        const sender = this._senderByClassCreate( serverStruct.senderClass ) ||
            this._senderByTypeCreate( serverStruct.type );
        this._senderAdd( sender );
        return sender;
    }

    _findSenderFromExists( serverStruct ) {
        let sender = this.senderByClassGet( serverStruct.senderClass );
        sender = sender || this.senderByTypeGet( serverStruct.type );
        return sender;
    }

    _senderByClassCreate( SenderClass ) {
        return ( SenderClass instanceof AbstractSender ) ?
            new SenderClass() : null;
    }

    _senderByTypeCreate( senderType ) {
        if ( !this.inSenderByType( senderType ) ) {
            try {
                const SenderClass = this._senderClassByTypeGet( senderType );
                return new SenderClass();
            } catch ( error ) {
                Log.log( error.toString() );
            }
        }
        return null;
    }

    _senderAdd( sender ) {
        if ( this.inSender( sender ) ) return;
        return this._senders.push( sender );
    }

}