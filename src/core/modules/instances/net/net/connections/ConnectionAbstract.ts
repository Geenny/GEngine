import { ObjectListPrimitive } from "data/types/commonTypes";
import IConnection from "../interfaces/IConnection"
import INetRequest from "../interfaces/INetRequest";

export default abstract class ConnectionAbstract implements IConnection {

	protected options: ObjectListPrimitive = { };

	get tries(): number { return this.options.tries as number || 3; }

	get streams(): number { return this.options.streams as number || 1; }

	get method(): string { return this.options.method as string || "HTTP" };


	//
	// REQUEST
	//

	requestSend( request: INetRequest ): void { }

}