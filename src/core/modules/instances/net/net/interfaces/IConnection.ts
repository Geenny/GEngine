import INetRequest from "./INetRequest";

export default interface IConnection {

	readonly tries: number;

	readonly streams: number;

	readonly method: string; // HTTP, WSS

	requestSend( request: INetRequest ): void;

}