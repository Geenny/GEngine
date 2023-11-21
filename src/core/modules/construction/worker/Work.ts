import EventDispatcher from "core/machines/event/EventDispatcher";
import IInit from "../init/interface/IInit";
import IWork from "./interface/IWork";
import WorkEvent from "./event/WorkEvent";
import { WorkState } from "./state/WorkState";

export default class Work extends EventDispatcher implements IWork, IInit {

	private _state: WorkState = WorkState.NONE;

	public get isInit(): boolean { return this.state !== WorkState.NONE; }

	public get isStarted(): boolean { return this.state === WorkState.WORK || this.state === WorkState.PAUSED; }

	public get isPaused(): boolean { return this.state === WorkState.PAUSED; }

	public get state(): WorkState { return this._state; }
	public set state( value: WorkState ) {
		this._state = value;
	}

	init(): IInit {
		if ( this.state === WorkState.NONE ) {
			this.dispatchEvent( new WorkEvent( WorkEvent.INIT, this.state ) );
			this.processInit();
		}
			
		return this;
	}

	destroy(): IInit {
		if ( !this.isInit ) {
			if ( this.isStarted)
				this.stop();

			this.dispatchEvent( new WorkEvent( WorkEvent.DESTROY, this.state ) );
			this.processDestroy();
		}
			
		return this;
	}

	start(): IWork {
		if ( this.isInit && !this.isStarted ) {
			this.dispatchEvent( new WorkEvent( WorkEvent.START, this.state ) );
			this.processStart();
		}

		return this;
	}

	stop(): IWork {
		if ( this.isStarted ) {
			this.dispatchEvent( new WorkEvent( WorkEvent.STOP, this.state ) );
			this.processStop();
		}

		return this;
	}

	pause(): IWork {
		if ( this.isStarted && !this.isPaused ) {
			this.dispatchEvent( new WorkEvent( WorkEvent.PAUSE, this.state ) );
			this.processPause();
		}

		return this;
	}

	resume(): IWork {
		if ( this.isPaused ) {
			this.dispatchEvent( new WorkEvent( WorkEvent.RESUME, this.state ) );
			this.processResume();
		}

		return this;
	}


	protected processInit(): void {
		this.readyInit();
	}
	protected processDestroy(): void {
		this.readyDestroy();
	}
	protected processStart(): void {
		this.readyStart();
	}
	protected processStop(): void {
		this.readyStop();
	}
	protected processPause(): void {
		this.readyPause();
	}
	protected processResume(): void {
		this.readyResume();
	}


	protected readyInit(): void {
		this.state = WorkState.INIT;
		this.dispatchEvent( new WorkEvent( WorkEvent.INITED, this.state ) );
	}
	protected readyDestroy(): void {
		this.state = WorkState.NONE;
		this.dispatchEvent( new WorkEvent( WorkEvent.DESTROYED, this.state ) );
	}
	protected readyStart(): void {
		this.state = WorkState.WORK;
		this.dispatchEvent( new WorkEvent( WorkEvent.STARTED, this.state ) );
	}
	protected readyStop(): void {
		this.state = WorkState.INIT;
		this.dispatchEvent( new WorkEvent( WorkEvent.STOPPED, this.state ) );
	}
	protected readyPause(): void {
		this.state = WorkState.PAUSED;
		this.dispatchEvent( new WorkEvent( WorkEvent.PAUSED, this.state ) );
	}
	protected readyResume(): void {
		this.state = WorkState.WORK;
		this.dispatchEvent( new WorkEvent( WorkEvent.RESUMED, this.state ) );
	}

}