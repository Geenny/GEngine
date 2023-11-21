import Event from "core/machines/event/Event";
import { WorkState } from "../state/WorkState";

export default class WorkEvent extends Event {

	public static INIT: string = "work.init";
	public static INITED: string = "work.inited";
	public static START: string = "work.start";
	public static STARTED: string = "work.started";
	public static STOP: string = "work.stop";
	public static STOPPED: string = "work.stoped";
	public static PAUSE: string = "work.pause";
	public static PAUSED: string = "work.paused";
	public static RESUME: string = "work.resume";
	public static RESUMED: string = "work.resumed";
	public static DESTROY: string = "work.destroy";
	public static DESTROYED: string = "work.destroyed";

	public state: WorkState = WorkState.NONE;

	constructor( type: string, state: WorkState ) {
		super( type );
		this.state = state;
	}

}
