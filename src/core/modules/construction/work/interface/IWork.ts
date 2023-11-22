import Work from "../Work";
import { WorkState } from "../state/state";

export default interface IWork {

	readonly isStarted: boolean;
	
	readonly isPaused: boolean;

	readonly state: WorkState;

	init(): Promise<Work>;

	destroy(): Promise<Work>;

	start(): Promise<Work>;

	stop(): Promise<Work>;

	pause(): Promise<Work>;

	resume(): Promise<Work>;

}