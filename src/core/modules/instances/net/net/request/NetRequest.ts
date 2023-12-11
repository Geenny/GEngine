import { ObjectListAny, RecieveMethods } from "data/types/commonTypes";
import { RequestData, ServerData } from "../../types/netTypes";
import UtilsNumber from "utils/common/UtilsNumber";

export default class NetRequest {

	protected requestData: RequestData;
	protected receiveMethods: RecieveMethods;
	protected options: ObjectListAny;

	readonly ID: number;

	get type(): string { return this.requestData.type || "none"; }

	get data(): ObjectListAny { return this.requestData.data; }

	get serverData(): ServerData { return this.requestData.serverData; }

	get priority(): number { return this.requestData.priority || 0; }

	constructor( requestData: RequestData, methods?: RecieveMethods, options?: ObjectListAny ) {
		this.requestDataSet( requestData );
		this.methodsSet( methods );
		this.optionsSet( options );

		this.ID = UtilsNumber.unique( "request" );
	}

	protected requestDataSet( requestData: RequestData ): void {
		this.requestData = requestData || { type: "none" };
	}

	protected methodsSet( methods: RecieveMethods ): void {
		if ( !methods ) this.receiveMethods = { };

		this.receiveMethods = methods;
	}

	protected optionsSet( options: ObjectListAny ): void {
		this.options = options || { };
	}


	//
	// TO STRING TYPE
	//

	toString(): string {
		const data = this.data ? JSON.stringify( this.data ) : "none";
		return `ID: ${ this.ID }, type: ${ this.type }, data: ${ data }`;
	}

}