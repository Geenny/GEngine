import { ID } from "data/types/common";
import { ServerMethod } from "../../enums/ServerMethod";
import { ServerIPType } from "../../enums/ServerIPType";
import { ServerOptions } from "../../types/serverTypes";
import INetRequest from "./INetRequest";
import Process from "core/modules/construction/process/Process";
import IProcess from "core/modules/construction/process/interface/IProcess";

export default interface IConnection extends IProcess {

	readonly isDefault: boolean;

	readonly ID: ID;

	readonly name: string;

	readonly host: string;

	readonly port: number;

	readonly method: ServerMethod;

	readonly ipType: ServerIPType;

	readonly tries: number;

	readonly streams: number;

	requestSend( request: INetRequest ): void;

}