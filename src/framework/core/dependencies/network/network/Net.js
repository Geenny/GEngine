import DependencyAbstract from "../../../machines/dependency/DependencyAbstract";
import ServerStruct from "./struct/ServerStruct";
import ObjectUtils from "../../../../utils/tech/ObjectUtils";
import AbstractLoader from "./loaders/AbstractLoader";
import Log from "../../../../utils/log/Log";
import DependencyStates from "../../../machines/dependency/states/DependencyState";
import NetworkLoaderType from "./constants/NetworkLoaderType";
import ArrayUtils from "../../../../utils/tech/ArrayUtils";
import ContentMapper from "../../../../data/content/ContentMapper";
import HTTPLoader from "./loaders/HTTPLoader";
import ConnectionLoader from "./loaders/ConnectionLoader";

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
        super();
        this._initVO( netVO );
    }

    //
    // GET/SET
    //

    get servers() { return this._servers; }

    get application() { return this.vo.application; }

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
    _initVO( vo ) { this.vo = vo; }
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

    send( data, options = null ) {
        if ( this.state !== DependencyStates.WORKING ) return;
        const serverStruct = this.serverStructGet( options );
        return serverStruct.loader ? serverStruct.loader.send( data ) : null;
    }


    //
    // SERVER
    //

    /**
     * Инициализация серверов для связи приложения
     */
    _initServers() {
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
            serverStruct.loader = this.findServerLoader( serverStruct );
            serverStruct.ID = ArrayUtils.getUniqueNumericValue( "ID", this._servers );

            this._serverStructAdd( serverStruct );
        }
    }

    /**
     * Возвращает сервер по его @name или @ID или по типу его @loader
     * Если не один из параметров не удовлетворяет поиски, возвращается
     * сервер по умолчанию с @HTTPLoader .
     * @param {*} options 
     */
    serverStructGet( options = {} ) {
        let http = null;
        for ( let i = 0; i < this._servers.length; i++ ) {
            const server = this._servers[ i ];
            if ( !http && server.loader && server.loader.type === NetworkLoaderType.HTTP ) {
                http = server;
            }
            if ( options && options.ID && server.ID === options.ID )
                return server;
            if ( options && options.name && server.name === options.name )
                return server;
            if ( options && options.type && server.loader && server.loader.type === options.type )
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
    // LOADER
    //

    /**
     * Определить является ли @AbstractLoader посыльным для данного @Net
     * @param { AbstractLoader } loader 
     */
    inLoader( loader ) { return this._loaders.indexOf( loader ) !== -1; }

    /**
     * Определить является ли @AbstractLoader по его типу посыльным для данного @Net
     * @param {string} loaderType 
     */
    inLoaderByType( loaderType ) {
        return this.inLoader( this.loaderByTypeGet( loaderType ) )
    }

    /**
     * 
     * @param { ServerStruct } serverStruct 
     */
    findServerLoader( serverStruct ) {
        const loader = this._findLoaderFromExists( serverStruct );
        return loader || this._loaderCreate( serverStruct );
    }

    /**
     * Вернуть @AbstractLoader по его типу
     * @param { string } loaderType 
     */
    loaderByTypeGet( loaderType ) {
        return ArrayUtils.findAsObject( this._loaders, "type", loaderType );
    }

    /**
     * 
     * @param { AbstractLoader } loaderClass 
     */
    loaderByClassGet( loaderClass ) {
        return ArrayUtils.findAsObject( this._loaders, "loaderClass", loaderClass );
    }

    /**
     * Вернуть класс сендера по его @loaderType из @loaderMapper
     * @param { string } loaderType 
     */
    _loaderClassByTypeGet( loaderType ) {
        return this.loaderMapper.get( loaderType );
    }

    _loaderCreate( serverStruct ) {
        const loader = this._loaderByClassCreate( serverStruct.loaderClass ) ||
            this._loaderByTypeCreate( serverStruct.type );
        loader.init( serverStruct );
        this._loaderAdd( loader );
        return loader;
    }

    _findLoaderFromExists( serverStruct ) {
        let loader = this.loaderByClassGet( serverStruct.loaderClass );
        loader = loader || this.loaderByTypeGet( serverStruct.type );
        return loader;
    }

    _loaderByClassCreate( LoaderClass ) {
        return ( LoaderClass instanceof AbstractLoader ) ?
            new LoaderClass() : null;
    }

    _loaderByTypeCreate( loaderType ) {
        if ( !this.inLoaderByType( loaderType ) ) {
            try {
                const LoaderClass = this._loaderClassByTypeGet( loaderType );
                return new LoaderClass();
            } catch ( error ) {
                Log.l( error.toString() );
            }
        }
        return null;
    }

    _loaderAdd( loader ) {
        if ( this.inLoader( loader ) ) return;
        return this._loaders.push( loader );
    }

}