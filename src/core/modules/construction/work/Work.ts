import EventDispatcher from "core/machines/event/EventDispatcher";
import IWork from "./interface/IWork";
import WorkEvent from "./event/WorkEvent";
import PromiseProcessor from "data/promise/PromiseProcessor";
import { WorkState } from "./state/state";
import { WorkStatus } from "./state/status";

export default class Work extends EventDispatcher implements IWork {

	private _state: WorkState = WorkState.NONE;

	protected promise: PromiseProcessor = new PromiseProcessor();
	protected promiseAwait: PromiseProcessor = new PromiseProcessor();

	public get isInit(): boolean { return this.state !== WorkState.NONE; }

	public get isStarted(): boolean { return this.state === WorkState.WORK || this.state === WorkState.PAUSED; }

	public get isPaused(): boolean { return this.state === WorkState.PAUSED; }

	public get state(): WorkState { return this._state; }
	public set state( value: WorkState ) { this._state = value; }

	async init(): Promise<Work> {
		return this.processInitStart();
	}

	async destroy(): Promise<Work> {
		return this.processDestroyStart();
	}

	async start(): Promise<Work> {
		return this.processStartStart();
	}

	async stop(): Promise<Work> {
		return this.processStopStart();
	}

	async pause(): Promise<Work> {
		return this.processPauseStart();
	}

	async resume(): Promise<Work> {
		return this.processResumeStart();
	}


	//
	// PROCESS START
	//

	protected async processInitStart(): Promise<Work> {
		const promise = this.onInitPromise();

		if ( this.state !== WorkState.NONE )
			return Promise.resolve( this );

		this.onInitStart();

		await this.onInit();

		this.onInitComplete();
		this.onInitReady();

		return promise;
	}

	protected async processDestroyStart(): Promise<Work> {
		const promise = this.onDestroyPromise();

		if ( this.promise.length > 1 )
			await this.awaitDestroy();

		if ( !this.isInit )
			return Promise.resolve( this );

		if ( this.isStarted )
			await this.stop();

		this.onDestroyStart();

		await this.onDestroy();

		this.onDestroyComplete();
		this.onDestroyReady();

		return promise;
	}

	protected async processStartStart(): Promise<Work> {
		const promise = this.onStartPromise();

		if ( this.promise.length > 1 )
			await this.awaitStart();

		if ( !this.isInit || this.isStarted )
			return Promise.resolve( this );

		this.onStartStart();

		await this.onStart();

		this.onStartComplete();
		this.onStartReady();

		return promise;
	}

	protected async processStopStart(): Promise<Work> {
		const promise = this.onStopPromise();

		if ( this.promise.length > 1 )
			await this.awaitStop();

		if ( !this.isStarted )
			return Promise.resolve( this );

		this.onStopStart();

		await this.onStop();

		this.onStopComplete();
		this.onStopReady();

		return promise;
	}

	protected async processPauseStart(): Promise<Work> {
		const promise = this.onPausePromise();

		if ( this.promise.length > 1 )
			await this.awaitPause();
	
		if ( !this.isStarted || this.isPaused )
			return Promise.resolve( this );

		this.onPauseStart();

		await this.onPause();

		this.onPauseComplete();
		this.onPauseReady();

		return promise;
	}

	protected async processResumeStart(): Promise<Work> {
		const promise = this.onResumePromise();

		if ( this.promise.length > 1 )
			await this.awaitResume();

		if ( !this.isPaused )
			return Promise.resolve( this );

		this.onResumeStart();

		await this.onResume();

		this.onResumeComplete();
		this.onResumeReady();

		return promise;
	}


	//
	// ON
	//

	protected async onInit( ): Promise<void> { return Promise.resolve(); }
	protected async onDestroy(): Promise<void> { return Promise.resolve(); }
	protected async onStart(): Promise<void> { return Promise.resolve(); }
	protected async onStop(): Promise<void> { return Promise.resolve(); }
	protected async onPause(): Promise<void> { return Promise.resolve(); }
	protected async onResume(): Promise<void> { return Promise.resolve(); }


	//
	// AWAIT STATUS
	//

	protected awaitPromiseResolve(): void {
		const statusStruct = this.promiseAwait.shift();
		if ( !statusStruct || !statusStruct.struct ) return;

		statusStruct.struct.resolve();
	}

	protected awaitDestroy(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( WorkStatus.DESTROY, { resolve, reject } );
		});
	}

	protected awaitStart(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( WorkStatus.START, { resolve, reject } );
		});
	}

	protected awaitStop(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( WorkStatus.STOP, { resolve, reject } );
		});
	}

	protected awaitPause(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( WorkStatus.PAUSE, { resolve, reject } );
		});
	}

	protected awaitResume(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( WorkStatus.RESUME, { resolve, reject } );
		});
	}


	//
	// PROMISE CREATE
	//

	protected onInitPromise(): Promise<Work> {
		return new Promise<Work>( ( resolve, reject ) => {
			this.promise.add( WorkStatus.INIT, { resolve, reject, target: this } );
		});
	}
	protected onDestroyPromise(): Promise<Work> {
		return new Promise<Work>( ( resolve, reject ) => {
			this.promise.add( WorkStatus.DESTROY, { resolve, reject, target: this } );
		});
	}
	protected onStartPromise(): Promise<Work> {
		return new Promise<Work>( ( resolve, reject ) => {
			this.promise.add( WorkStatus.START, { resolve, reject, target: this } );
		});
	}
	protected onStopPromise(): Promise<Work> {
		return new Promise<Work>( ( resolve, reject ) => {
			this.promise.add( WorkStatus.STOP, { resolve, reject, target: this } );
		});
	}
	protected onPausePromise(): Promise<Work> {
		return new Promise<Work>( ( resolve, reject ) => {
			this.promise.add( WorkStatus.PAUSE, { resolve, reject, target: this } );
		});
	}
	protected onResumePromise(): Promise<Work> {
		return new Promise<Work>( ( resolve, reject ) => {
			this.promise.add( WorkStatus.RESUME, { resolve, reject, target: this } );
		});
	}


	//
	// PROMISE RESOLVE
	//

	protected promiseStructResolveByStatus( status: WorkStatus ): boolean {
		const statusStruct = this.promise.remove( status );
		if ( !statusStruct || !statusStruct.struct ) return false;

		statusStruct.struct.resolve();

		return true;
	}
	protected onInitPromiseResolve(): void {
		this.promiseStructResolveByStatus(  WorkStatus.INIT );
	}
	protected onDestroyPromiseResolve(): void {
		this.promiseStructResolveByStatus(  WorkStatus.DESTROY );
	}
	protected onStartPromiseResolve(): void {
		this.promiseStructResolveByStatus(  WorkStatus.START );
	}
	protected onStopPromiseResolve(): void {
		this.promiseStructResolveByStatus(  WorkStatus.STOP );
	}
	protected onPausePromiseResolve(): void {
		this.promiseStructResolveByStatus(  WorkStatus.PAUSE );
	}
	protected onResumePromiseResolve(): void {
		this.promiseStructResolveByStatus(  WorkStatus.RESUME );
	}


	//
	// START
	//

	protected onInitStart(): void {
		this.dispatchEvent( new WorkEvent( WorkEvent.INIT, this.state ) );
	}
	protected onDestroyStart(): void {
		this.dispatchEvent( new WorkEvent( WorkEvent.DESTROY, this.state ) );
	}
	protected onStartStart(): void {
		this.dispatchEvent( new WorkEvent( WorkEvent.START, this.state ) );
	}
	protected onStopStart(): void {
		this.dispatchEvent( new WorkEvent( WorkEvent.STOP, this.state ) );
	}
	protected onPauseStart(): void {
		this.dispatchEvent( new WorkEvent( WorkEvent.PAUSE, this.state ) );
	}
	protected onResumeStart(): void {
		this.dispatchEvent( new WorkEvent( WorkEvent.RESUME, this.state ) );
	}


	//
	// COPMPLETE
	//

	protected onInitComplete(): void {
		this.state = WorkState.INIT;

		this.onInitPromiseResolve();

		this.dispatchEvent( new WorkEvent( WorkEvent.INITED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onDestroyComplete(): void {
		this.state = WorkState.NONE;

		this.onDestroyPromiseResolve();

		this.dispatchEvent( new WorkEvent( WorkEvent.DESTROYED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onStartComplete(): void {
		this.state = WorkState.WORK;

		this.onStartPromiseResolve();

		this.dispatchEvent( new WorkEvent( WorkEvent.STARTED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onStopComplete(): void {
		this.state = WorkState.INIT;

		this.onStopPromiseResolve();

		this.dispatchEvent( new WorkEvent( WorkEvent.STOPPED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onPauseComplete(): void {
		this.state = WorkState.PAUSED;

		this.onPausePromiseResolve();

		this.dispatchEvent( new WorkEvent( WorkEvent.PAUSED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onResumeComplete(): void {
		this.state = WorkState.WORK;

		this.onResumePromiseResolve();
		
		this.dispatchEvent( new WorkEvent( WorkEvent.RESUMED, this.state ) );

		this.awaitPromiseResolve();
	}



	//
	// READY
	//

	protected onInitReady(): void { }
	protected onDestroyReady(): void { }
	protected onStartReady(): void { }
	protected onStopReady(): void { }
	protected onPauseReady(): void { }
	protected onResumeReady(): void { }

}