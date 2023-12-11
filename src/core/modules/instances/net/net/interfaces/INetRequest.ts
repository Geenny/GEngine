import { ObjectListAny } from "data/types/commonTypes";
import { ServerData } from "../../types/netTypes";

export default interface INetRequest {

	type: string;

	data?: ObjectListAny,

	serverData?: ServerData,

	priority?: number;

}