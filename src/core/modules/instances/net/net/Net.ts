import { injectable } from "inversify";
import { PromiseStruct } from "data/promise/PromiseStruct";
import { promiseStructGet } from "data/promise/methods/methods";
import { ObjectListAny, RecieveMethods } from "data/types/commonTypes";
import { RequestData } from "../types/netTypes";
import INet from "./interfaces/INet";
import Dependency from "../../dependency/dependency/Dependency";
import INetRequest from "./interfaces/INetRequest";
import NetRequest from "./request/NetRequest";
import IConnection from "./interfaces/IConnection";
import ConnectionHTTP from "./connections/ConnectionHTTP";
import Log from "utils/log/Log";

@injectable()
export default class Net extends Dependency implements INet {

    protected static instance: INet;

    public static send( data: RequestData, methods?: RecieveMethods, options?: ObjectListAny ): INetRequest {
        return Net.instance.send( data, methods, options );
    }

    protected connection: IConnection;

    // TODO Refactor & Think how it should work
	public server: any;

    // TEMP for test
    protected promiseReadyStruct: PromiseStruct;

    constructor() {
        super();
        Net.instance = this;
    }


    //
    // INIT
    //

    protected async onInit(): Promise<void> {
        await super.onInit();
        this.promiseReadyStructInit();
    }


    //
    // START
    //

    protected async onStart(): Promise<void> {
        await super.onStart();
        if (!this.promiseReadyStruct)
            debugger;

        setTimeout( () => this.promiseReadyStruct.resolve(), 500 );

        await this.promiseReadyStruct.promise;
    }


    //
    // PROMISE READY
    //

    protected promiseReadyStructInit(): void {
        this.promiseReadyStruct = promiseStructGet( this );
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
    // CONNECTION
    //

    protected connectionByRequestGet( request: INetRequest ): IConnection {
        if ( !this.connection ) this.connection = new ConnectionHTTP();
        return this.connection;
    }

    protected connectionSend( connection: IConnection, request: INetRequest ): void {
        if ( !connection )
            Log.e( `NET: ${ this.name }: No connection find to send request ${ request.toString() }!!!` )
        // TODO Put in list
        // Listent connection
        connection.requestSend( request );
    }

}