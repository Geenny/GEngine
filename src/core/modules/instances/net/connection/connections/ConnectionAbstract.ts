import { ID, ObjectListPrimitive } from "data/types/common";
import { ServerMethod } from "../../enums/ServerMethod";
import IConnection from "../../main/interfaces/IConnection"
import INetRequest from "../../main/interfaces/INetRequest";
import Process from "core/modules/construction/process/Process";
import { ServerIPType } from "../../enums/ServerIPType";
import { ServerOptions } from "../../types/serverTypes";

export default abstract class ConnectionAbstract extends Process implements IConnection {

	private _isDefault: boolean = false;

	protected options: ServerOptions = { host: "none" };

	get isDefault(): boolean { return this._isDefault; }

	get ID(): ID { return this.options.ID as ID; }

	get name(): string { return this.options.name as string; }

	get host(): string { return this.options.host as string; }

	get port(): number { return this.options.port as number; }

	get method(): ServerMethod { return this.options.method as ServerMethod || ServerMethod.HTTP };

	get ipType(): ServerIPType { return this.options.ipType as ServerIPType || ServerIPType.IP4; };

	get tries(): number { return this.options.tries as number || 3; }

	get streams(): number { return this.options.streams as number || 1; }


	constructor( options: ServerOptions ) {
		super();
		this.optionsSet( options );
	}



	//
	// OPTIONS
	//

	protected optionsSet( options: ServerOptions ): void {
		this.options = options;
	}



	//
	// PROCESS
	//

	async onInit(): Promise<void> {
		await super.onInit();

	}

	async onStart(): Promise<void> {
		await super.onStart();
		
	}

	async onStop(): Promise<void> {
		await super.onStop();
		
	}

	async onDestroy(): Promise<void> {
		await super.onDestroy();
		
	}


	//
	// REQUEST
	//

	requestSend( request: INetRequest ): void { }

}