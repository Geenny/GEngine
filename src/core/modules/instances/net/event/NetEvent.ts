import Event from "core/machines/event/Event";
import INetRequest from "../net/interfaces/INetRequest";

export default class NetEvent extends Event {

	public static INIT: string = "net.init";
	public static START: string = "net.start";
	public static LOAD: string = "net.stop";

	public request: INetRequest;

	constructor( type: string, request: INetRequest ) {
		super( type );
		this.request = request;
	}

}
