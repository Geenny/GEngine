import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";
import ServerStruct from "../struct/ServerStruct";
import ArrayUtils from "../../../../utils/tech/ArrayUtils";
import LoaderStruct from "../loaders/struct/LoaderStruct";
import LoaderEvent from "../loaders/events/LoaderEvent";
import Event from "../../../machines/event/Event";
import { Loader } from "three";
import AbstractLoader from "../loaders/AbstractLoader";
import Log from "../../../../utils/log/Log";

export default class Server extends EventDispatcherVOWrapper {

    constructor( serverStruct = { ...ServerStruct } ) {
        super();
        this.init( serverStruct );
    }


    //
    // GET/SET
    //

    get serverStruct() { return this._serverStruct; }

    get loaders() { return this._loaders; }

    get type() { return this._serverStruct.type; }

    get state() { return this._state; }

    get isOneLoader() { return !!this._loader; }

    get isRequestQueueLimit() { return this.requestQueueCount <= 0 ||
        this._sended.length >= this.requestQueueCount }

    get requestQueueCount() { return this.serverStruct.requestQueueCount; }
    set requestQueueCount( value ) { this.serverStruct.requestQueueCount = value; }

    get isRequestForSend() { return this._loaderStructList.length > 0; }


    //
    // INIT
    //

    init( serverStruct ) {
        this._serverStruct = serverStruct;
        this._initVars();
    }

    _initVars() {
        this._sended = [];
        this._loaderStructList = [];
    }


    //
    // SEND
    //

    send( data, options = null ) {
        const loader = this.loaderCreate( data, options );
        return loader;
    }



    //
    // LOADER
    //

    loaderCreate( data, options ) {
        const loader = this._loaderCreate( this.serverStruct );
        const loaderStruct = this._loaderStructCreate( data, options );
        loaderStruct.loader = loader;
        this._loaderStructAdd( loaderStruct );
        this._loaderQueueNext();
        return loader;
    }

    loaderStructGet( loader ) {
        return ArrayUtils.findAsObject( this._loaderStructList, "loader", loader );
    }

    /**
     * Определить является ли @AbstractLoader посыльным для данного @Net
     * @param { AbstractLoader } loader 
     */
    inLoader( loader ) {
        return !!ArrayUtils.findAsObject( this._loaderStructList, "loader", loader );
    }

    /**
     * 
     * @param { ServerStruct } serverStruct 
     */
    findServerLoader( serverStruct ) {
        const loader = this._findLoaderFromExists( serverStruct );
        return loader || this._loaderCreate( serverStruct );
    }

    _loaderStructCreate( data, options =  {} ) {
        return { ...LoaderStruct, data, options };
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
        try {
            const LoaderClass = this._loaderClassByTypeGet( loaderType );
            return new LoaderClass();
        } catch ( error ) {
            Log.l( error.toString() );
        }
        return null;
    }

    _loaderStructAdd( loaderStruct ) {
        if ( this.inLoader( loaderStruct.loader ) ) return;
        return this._loaderStructList.push( loaderStruct );
    }

    _loaderStructRemove( loaderStruct ) {
        let index = this._loaderStructList.indexOf( loaderStruct );
        if ( index >= 0 ) this._loaderStructList.splice( index, 1 );

        index = this._sended.indexOf( loaderStruct );
        if ( index >= 0 ) this._sended.splice( index, 1 );
    }

    _loaderQueueNext() {
        this._loaderSendAllPossible();
    }

    _loaderSendAllPossible() {
        while( this.isRequestForSend && !this.isRequestQueueLimit ) {
            this._loaderSend();
        }
    }
   
    _loaderSend() {
        if ( !this.isRequestForSend ) return;
        const loaderStruct = this._loaderStructList.shift();
        this._sended.push( loaderStruct );
        this._loaderSendProcess( loaderStruct );
    }

    _loaderSendProcess( loaderStruct ) {
        this._loaderListenersSet( loaderStruct.loader );
        this._loaderServerUpdate( loaderStruct );
        loaderStruct.loader.send( loaderStruct.data );
    }

    _loaderServerUpdate( loaderStruct ) {
        loaderStruct.loader.optionsUpdate( loaderStruct.options );
    }

    _loaderListenersSet( loader ) {
        loader.addEventListener( Event.ANY, this._loaderHandler, this );
    }
    _loaderHandler( event ) {
        switch( event.type ) {
            case LoaderEvent.PROGRESS:
                Log.l( event );
                break;
            case LoaderEvent.ERROR:
            case LoaderEvent.CANCEL:

                break;
            case LoaderEvent.COMPLETE:
                this._loaderComplete( event.target );
                break;
        }
    }
    _loaderComplete( loader ) {
        const loaderStruct = this.loaderStructGet( loader );
        this._loaderDestroy( loaderStruct );
        this._loaderQueueNext();
    }

    _loaderDestroy( loaderStruct ) {
        this._loaderStructRemove( loaderStruct );
    }

}