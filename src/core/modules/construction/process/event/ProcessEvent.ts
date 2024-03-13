import Event from "core/machines/event/Event";
import { ProcessState } from "../state/state";

export default class ProcessEvent extends Event {

	public static INIT: string = "process.init";
	public static INITED: string = "process.inited";
	public static START: string = "process.start";
	public static STARTED: string = "process.started";
	public static STOP: string = "process.stop";
	public static STOPPED: string = "process.stoped";
	public static PAUSE: string = "process.pause";
	public static PAUSED: string = "process.paused";
	public static RESUME: string = "process.resume";
	public static RESUMED: string = "process.resumed";
	public static DESTROY: string = "process.destroy";
	public static DESTROYED: string = "process.destroyed";

	public state: ProcessState = ProcessState.NONE;

	constructor( type: string, state: ProcessState ) {
		super( type );
		this.state = state;
	}

}
