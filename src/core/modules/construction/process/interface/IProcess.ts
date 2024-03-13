import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import Process from "../Process";
import { ProcessState } from "../state/state";

export default interface IProcess extends IEventDispatcher {

	readonly isStarted: boolean;
	
	readonly isPaused: boolean;

	readonly state: ProcessState;

	init(): Promise<Process>;

	destroy(): Promise<Process>;

	start(): Promise<Process>;

	stop(): Promise<Process>;

	pause(): Promise<Process>;

	resume(): Promise<Process>;

}