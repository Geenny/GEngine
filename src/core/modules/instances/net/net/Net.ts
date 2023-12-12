import { injectable } from "inversify";
import { ObjectListAny, RecieveMethods } from "data/types/commonTypes";
import { RequestData } from "../types/netTypes";
import { ServerOptions } from "../types/serverTypes";
import { ServerMethod } from "../enums/ServerMethod";
import INet from "./interfaces/INet";
import INetRequest from "./interfaces/INetRequest";
import Dependency from "../../dependency/dependency/Dependency";
import Work from "core/modules/construction/work/Work";
import NetRequest from "./request/NetRequest";
import IConnection from "./interfaces/IConnection";
import Connection from "../connections/Connection";
import ConnectionHTTP from "../connections/ConnectionHTTP";
import Log from "utils/log/Log";
import { ServerIPType } from "../enums/ServerIPType";

@injectable()
export default class Net extends Dependency implements INet {

    protected static instance: INet;

    public static send( data: RequestData, methods?: RecieveMethods, options?: ObjectListAny ): INetRequest {
        return Net.instance.send( data, methods, options );
    }

	protected serverOptionsList: ServerOptions[] = [];

    protected connectionList: IConnection[] = [];

    constructor() {
        super();
        Net.instance = this;
    }


    //
    // INIT
    //

    protected async onInit(): Promise<void> {
        await super.onInit();
        this.serverOptionsInit();
        await this.connectionInit();
    }


    //
    // START
    //

    protected async onStart(): Promise<void> {
        await super.onStart();
        await this.connectionStart();
    }



    //
    // SEND
    //

    public send( data: RequestData, methods?: RecieveMethods, options?: ObjectListAny ): INetRequest {
        if ( !this.isWorking ) return;

        const request = this.requestGet( data, methods, options );
        const connection = this.connectionByRequestGet( request );
        this.connectionSend( connection, request );

        return request;
    }


    //
    // REQUEST
    //

    protected requestGet( data: RequestData, methods?: RecieveMethods, options?: ObjectListAny ): INetRequest {
        return new NetRequest( data, methods, options );
    }


    //
    // SERVER
    //

    protected serverOptionsInit(): void {
        if ( !this.vo.options || !this.vo.options.serverList ) return;
        this.vo.options.serverList.forEach( ( data: any, index: number ) => {
            const { name, host, port, method, ipType, tries, streams } = data;

            const options: ServerOptions = {
                isDeafult: index === 0,
                ID: index,
                name,
                host,
                port,
                method: method || ServerMethod.HTTP,
                ipType: ipType || ServerIPType.IP4,
                tries: tries || 3,
                streams: streams || 1
            };

            this.serverOptionsList.push( options );
        } );
    }


    //
    // CONNECTION
    //

    protected connectionCreateAll(): void {
        this.connectionList = this.serverOptionsList.map( options => this.connectionCreate( options ) );
    }

    protected connectionCreate( options: ServerOptions ): IConnection {
        const ConnectionClass = this.connectionClassByMethodGet( options.method );
        const connection = new ConnectionClass( options );
        this.connectionSubscribe( connection );
        return connection;
    }

    protected connectionClassByMethodGet( method?: ServerMethod ): typeof Connection {
        switch ( method ) {
            case ServerMethod.CONNECTION:
            case ServerMethod.HTTP:
                return ConnectionHTTP;
            default:
                return Connection;
        }
    }

    protected connectionByRequestGet( request: INetRequest ): IConnection {
        const connection = this.connectionList.find( connection => 
            request.serverOptions?.ID === connection.ID ||
            request.serverOptions?.name === connection.name ||
            request.serverOptions?.host === connection.host ||
            connection.isDefault
        );
        return connection;
    }

    protected connectionSubscribe( connection: IConnection ): void {

    }

    async connectionInit(): Promise<Work[]> {
        this.connectionCreateAll();

        const promises = this.connectionList.map( connection => connection.init() );
        return Promise.all( promises );
    }

    async connectionDestroy(): Promise<Work[]> {
        const promises = this.connectionList.map( connection => connection.destroy() );
        return Promise.all( promises );
    }

    async connectionStart(): Promise<Work[]> {
        const promises = this.connectionList.map( connection => connection.start() );
        return Promise.all( promises );
    }

    async connectionStop(): Promise<Work[]> {
        const promises = this.connectionList.map( connection => connection.stop() );
        return Promise.all( promises );
    }

    protected connectionSend( connection: IConnection, request: INetRequest ): void {
        if ( !connection )
            Log.e( `NET: ${ this.name }: No connection find to send request ${ request.toString() }!!!` )
        // TODO Put in list
        // Listent connection
        connection.requestSend( request );
    }

}