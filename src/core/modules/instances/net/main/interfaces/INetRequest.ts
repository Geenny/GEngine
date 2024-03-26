import { ObjectListAny } from "data/types/common";
import { ServerOptions } from "../../types/serverTypes";

export default interface INetRequest {

	type: string;

	data?: ObjectListAny,

	serverOptions?: ServerOptions,

	priority?: number;

}