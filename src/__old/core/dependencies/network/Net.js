import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import NetServerStruct from "./struct/NetServerStruct";
import DependencyStates from "../../machines/dependency/states/DependencyState";
import NetworkLoaderType from "./constants/NetworkLoaderType";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
import ContentMapper from "../../../data/content/ContentMapper";
import LoaderHTTP from "./loaders/LoaderHTTP";
import LoaderConnection from "./loaders/LoaderConnection";
import NetServer from "./server/NetServer";
import NetVO from "./vo/NetVO";

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

    get randomLink() { return true || this._randomLink; }
    set randomLink( value ) { this._randomLink = value; }

    get randomValue() {
        if ( !this._randomValue ) this._randomValue = Math.floor( Math.random() * Math.pow( 2, 32 ) );
        return this._randomValue;
    }

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
        mapper[ NetworkLoaderType.HTTP ] = LoaderHTTP;
        mapper[ NetworkLoaderType.CONNECTION ] = LoaderConnection;
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
        Net.instance = null;
        this.stopComplete();
    }


    //
    // SEND
    //

    /**
     * Вернуть @NetServerStruct из заготовленного списка. Если в options будут указаны параметры сервера
     * который отсутствуе в списке, он будет создан на один запрос.
     * @param { Object } data Данные для отпревки на server. Данные параметр может быть задан пустым {}
     * @param { Options } options Опции для выбора загрузчика (отправщика данных)
     *                            { ID, name, type: NetworkLoaderType, server: "google.com" }
     */
    send( data, options = null ) {
        if ( this.state !== DependencyStates.WORKING ) return;
        options = this._optionsFormat( options );
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

    _optionsFormat( options ) {
        if ( this.randomLink ) {
            if ( !options ) options = { };
            options.randomValue = this.randomValue;
        }
        return options;
    }

    /**
     * Добавить сервер по исходным данным.
     * Сервер возможно создать даже если присутствует только его тип.
     * @param { Options } serverData
     * @return { NetServer }
     */
    serverAddBySourceData( serverData = {} ) {
        if ( !this._serverDataCheck( serverData ) ) return null;

        const serverStruct = { ...NetServerStruct, ...serverData };
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
        const serverStruct = { ...NetServerStruct };
        serverStruct.type = serverType;
        return this._serverCreateByStruct( serverStruct );
    }

    /**
     * Возвращает сервер по его @name или @ID или по типу его @loader
     * Если не один из параметров не удовлетворяет поиски, возвращается
     * сервер по умолчанию с @LoaderHTTP .
     * @param { Object } options 
     */
    _serverDataCheck( serverData ) {
        return serverData && serverData.type;
    }
    _serverAdd( serverStruct ) {
        this._servers.push( serverStruct );
    }
    _serverCreateByStruct( serverStruct ) {
        const server = new NetServer( serverStruct );
        server.loaderMapper = this._loadersMapper;
        this._serverAdd( server );
        return server;
    }

}