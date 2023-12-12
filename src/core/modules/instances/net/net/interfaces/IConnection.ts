import { ID } from "data/types/commonTypes";
import { ServerMethod } from "../../enums/ServerMethod";
import { ServerIPType } from "../../enums/ServerIPType";
import { ServerOptions } from "../../types/serverTypes";
import INetRequest from "./INetRequest";
import Work from "core/modules/construction/work/Work";
import IWork from "core/modules/construction/work/interface/IWork";

export default interface IConnection extends IWork {

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