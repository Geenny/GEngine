import EventDispatcher from "core/machines/event/EventDispatcher";
import IProcess from "./interface/IProcess";
import ProcessEvent from "./event/ProcessEvent";
import PromiseProcessor from "data/promise/PromiseProcessor";
import { ProcessState } from "./state/state";
import { ProcessStatus } from "./state/status";

export default class Process extends EventDispatcher implements IProcess {

	private _state: ProcessState = ProcessState.NONE;

	protected promise: PromiseProcessor = new PromiseProcessor();
	protected promiseAwait: PromiseProcessor = new PromiseProcessor();

	public get isInit(): boolean { return this.state !== ProcessState.NONE; }

	public get isStarted(): boolean { return this.state === ProcessState.WORK || this.state === ProcessState.PAUSED; }

	public get isPaused(): boolean { return this.state === ProcessState.PAUSED; }

	public get state(): ProcessState { return this._state; }
	public set state( value: ProcessState ) { this._state = value; }

	async init(): Promise<Process> {
		return this.processInitStart();
	}

	async destroy(): Promise<Process> {
		return this.processDestroyStart();
	}

	async start(): Promise<Process> {
		return this.processStartStart();
	}

	async stop(): Promise<Process> {
		return this.processStopStart();
	}

	async pause(): Promise<Process> {
		return this.processPauseStart();
	}

	async resume(): Promise<Process> {
		return this.processResumeStart();
	}


	//
	// PROCESS START
	//

	protected async processInitStart(): Promise<Process> {
		const promise = this.onInitPromise();

		if ( this.state !== ProcessState.NONE )
			return Promise.resolve( this );

		this.onInitStart();

		await this.onInit();

		this.onInitComplete();
		this.onInitReady();

		return promise;
	}

	protected async processDestroyStart(): Promise<Process> {
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

	protected async processStartStart(): Promise<Process> {
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

	protected async processStopStart(): Promise<Process> {
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

	protected async processPauseStart(): Promise<Process> {
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

	protected async processResumeStart(): Promise<Process> {
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
			this.promiseAwait.add( ProcessStatus.DESTROY, { resolve, reject } );
		});
	}

	protected awaitStart(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( ProcessStatus.START, { resolve, reject } );
		});
	}

	protected awaitStop(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( ProcessStatus.STOP, { resolve, reject } );
		});
	}

	protected awaitPause(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( ProcessStatus.PAUSE, { resolve, reject } );
		});
	}

	protected awaitResume(): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this.promiseAwait.add( ProcessStatus.RESUME, { resolve, reject } );
		});
	}


	//
	// PROMISE CREATE
	//

	protected onInitPromise(): Promise<Process> {
		return new Promise<Process>( ( resolve, reject ) => {
			this.promise.add( ProcessStatus.INIT, { resolve, reject, target: this } );
		});
	}
	protected onDestroyPromise(): Promise<Process> {
		return new Promise<Process>( ( resolve, reject ) => {
			this.promise.add( ProcessStatus.DESTROY, { resolve, reject, target: this } );
		});
	}
	protected onStartPromise(): Promise<Process> {
		return new Promise<Process>( ( resolve, reject ) => {
			this.promise.add( ProcessStatus.START, { resolve, reject, target: this } );
		});
	}
	protected onStopPromise(): Promise<Process> {
		return new Promise<Process>( ( resolve, reject ) => {
			this.promise.add( ProcessStatus.STOP, { resolve, reject, target: this } );
		});
	}
	protected onPausePromise(): Promise<Process> {
		return new Promise<Process>( ( resolve, reject ) => {
			this.promise.add( ProcessStatus.PAUSE, { resolve, reject, target: this } );
		});
	}
	protected onResumePromise(): Promise<Process> {
		return new Promise<Process>( ( resolve, reject ) => {
			this.promise.add( ProcessStatus.RESUME, { resolve, reject, target: this } );
		});
	}


	//
	// PROMISE RESOLVE
	//

	protected promiseStructResolveByStatus( status: ProcessStatus ): boolean {
		const statusStruct = this.promise.remove( status );
		if ( !statusStruct || !statusStruct.struct ) return false;

		statusStruct.struct.resolve();

		return true;
	}
	protected onInitPromiseResolve(): void {
		this.promiseStructResolveByStatus(  ProcessStatus.INIT );
	}
	protected onDestroyPromiseResolve(): void {
		this.promiseStructResolveByStatus(  ProcessStatus.DESTROY );
	}
	protected onStartPromiseResolve(): void {
		this.promiseStructResolveByStatus(  ProcessStatus.START );
	}
	protected onStopPromiseResolve(): void {
		this.promiseStructResolveByStatus(  ProcessStatus.STOP );
	}
	protected onPausePromiseResolve(): void {
		this.promiseStructResolveByStatus(  ProcessStatus.PAUSE );
	}
	protected onResumePromiseResolve(): void {
		this.promiseStructResolveByStatus(  ProcessStatus.RESUME );
	}


	//
	// START
	//

	protected onInitStart(): void {
		this.dispatchEvent( new ProcessEvent( ProcessEvent.INIT, this.state ) );
	}
	protected onDestroyStart(): void {
		this.dispatchEvent( new ProcessEvent( ProcessEvent.DESTROY, this.state ) );
	}
	protected onStartStart(): void {
		this.dispatchEvent( new ProcessEvent( ProcessEvent.START, this.state ) );
	}
	protected onStopStart(): void {
		this.dispatchEvent( new ProcessEvent( ProcessEvent.STOP, this.state ) );
	}
	protected onPauseStart(): void {
		this.dispatchEvent( new ProcessEvent( ProcessEvent.PAUSE, this.state ) );
	}
	protected onResumeStart(): void {
		this.dispatchEvent( new ProcessEvent( ProcessEvent.RESUME, this.state ) );
	}


	//
	// COPMPLETE
	//

	protected onInitComplete(): void {
		this.state = ProcessState.INIT;

		this.onInitPromiseResolve();

		this.dispatchEvent( new ProcessEvent( ProcessEvent.INITED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onDestroyComplete(): void {
		this.state = ProcessState.NONE;

		this.onDestroyPromiseResolve();

		this.dispatchEvent( new ProcessEvent( ProcessEvent.DESTROYED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onStartComplete(): void {
		this.state = ProcessState.WORK;

		this.onStartPromiseResolve();

		this.dispatchEvent( new ProcessEvent( ProcessEvent.STARTED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onStopComplete(): void {
		this.state = ProcessState.INIT;

		this.onStopPromiseResolve();

		this.dispatchEvent( new ProcessEvent( ProcessEvent.STOPPED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onPauseComplete(): void {
		this.state = ProcessState.PAUSED;

		this.onPausePromiseResolve();

		this.dispatchEvent( new ProcessEvent( ProcessEvent.PAUSED, this.state ) );

		this.awaitPromiseResolve();
	}
	protected onResumeComplete(): void {
		this.state = ProcessState.WORK;

		this.onResumePromiseResolve();
		
		this.dispatchEvent( new ProcessEvent( ProcessEvent.RESUMED, this.state ) );

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