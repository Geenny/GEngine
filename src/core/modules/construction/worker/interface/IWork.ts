export default interface IWork {

	readonly isStarted: boolean;
	
	readonly isPaused: boolean;

	start(): IWork;

	stop(): IWork;

	pause(): IWork;

	resume(): IWork;

}