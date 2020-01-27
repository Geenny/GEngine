import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import ServerStruct from "./struct/ServerStruct";
import ObjectUtils from "../../../utils/tech/ObjectUtils";
import AbstractLoader from "./loaders/AbstractLoader";
import Log from "../../../utils/log/Log";
import DependencyStates from "../../machines/dependency/states/DependencyState";
import NetworkLoaderType from "./constants/NetworkLoaderType";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
import ContentMapper from "../../../data/content/ContentMapper";
import HTTPLoader from "./loaders/HTTPLoader";
import ConnectionLoader from "./loaders/ConnectionLoader";
import Server from "./server/Server";

export default class Net extends DependencyAbstract {

    static send( data, options = null ) {
        if ( !Net.instance ) return null;
        return Net.instance.send( data, options );
    }

    /**
     * 
     * @param {NetVO} netVO Наследник @DependencyVO
     */
    constructor( netVO = new NetVO() ) {
        super( netVO );
    }

    //
    // GET/SET
    //

    get servers() { return this._servers; }

    get loaderMapper() { return this._loadersMapper; }

    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
        this._initContentMappers();
        this._initServers();
        Net.instance = this;
    }

    /**
     * Назначение NetVO. Происходит один раз из конструктора класса.
     * @param {NetVO} vo 
     */
    _initVars() {
        this._servers = [];
        this._loaders = [];
        this._loadersMapper = {};
    }
    _initContentMappers() {
        const mapper = { };
        mapper[ NetworkLoaderType.HTTP ] = HTTPLoader;
        mapper[ NetworkLoaderType.CONNECTION ] = ConnectionLoader;
        this._loadersMapper = new ContentMapper( { ...mapper, ...this.vo.loadersMapper } );
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

    /**
     * Вернуть @ServerStruct из заготовленного списка. Если в options будут указаны параметры сервера
     * который отсутствуе в списке, он будет создан на один запрос.
     * @param { Object } data Данные для отпревки на server. Данные параметр может быть задан пустым {}
     * @param { Options } options Опции для выбора загрузчика (отправщика данных)
     *                            { ID, name, type: NetworkLoaderType, server: "google.com" }
     */
    send( data, options = null ) {
        if ( this.state !== DependencyStates.WORKING ) return;
        const server = this.serverGet( options );
        return server.send( data, options );
    }


    //
    // SERVER
    //

    /**
     * Инициализация серверов для связи приложения
     */
    _initServers() {
        if ( !this.vo.serverList ) return;
        for ( let i = 0; i < this.vo.serverList.length; i++ ) {
            const serverData = this.vo.serverList[ i ];
            this.serverAddBySourceData( serverData );
        }
    }

    /**
     * Добавить сервер по исходным данным.
     * Сервер возможно создать даже если присутствует только его тип.
     * @param { Options } serverData
     * @return { Server }
     */
    serverAddBySourceData( serverData = {} ) {
        if ( !this._serverDataCheck( serverData ) ) return null;

        const serverStruct = { ...ServerStruct, ...serverData };
        serverStruct.ID = ArrayUtils.getUniqueNumericValue( "ID", this._servers );

        const server = this._serverCreateByStruct( serverStruct );
        return server;
    }

    /**
     * Возвращает сервер по типу его @loader
     * Если не один из параметров не удовлетворяет поиски, возвращается
     * сервер по умолчанию - первый из списка. Если для инициализации входящих данных
     * не менялись параметры создаваемых серверов, то это будет HTTP сервер.
     * @param { Object } options 
     */
    serverGet( options = {} ) {
        let server = this.serverByTypeGet( options.type );
        server = server || this._serverCreateByType( options.type );
        return server;
    }

    serverByTypeGet( serverType = NetworkLoaderType.HTTP ) {
        return ArrayUtils.findAsObject( this._servers, "type", serverType );
    }

    _serverCreateByType( serverType = NetworkLoaderType.HTTP ) {
        const serverStruct = { ...ServerStruct };
        serverStruct.type = serverType;
        return this._serverCreateByStruct( serverStruct );
    }

    /**
     * Возвращает сервер по его @name или @ID или по типу его @loader
     * Если не один из параметров не удовлетворяет поиски, возвращается
     * сервер по умолчанию с @HTTPLoader .
     * @param { Object } options 
     */
    _serverDataCheck( serverData ) {
        return serverData && serverData.type;
    }
    _serverAdd( serverStruct ) {
        this._servers.push( serverStruct );
    }
    _serverCreateByStruct( serverStruct ) {
        const server = new Server( serverStruct );
        server.loaderMapper = this._loadersMapper;
        this._serverAdd( server );
        return server;
    }

}