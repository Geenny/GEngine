import "reflect-metadata";
import { InjectionMachine, InjectionModule } from "../core/machines/injection";
import { ApplicationType } from "core/modules/instances/application/types/types";

export default class Entry {

	private _started: boolean = false;

	protected moduleClassList: typeof InjectionModule[] = [];
	protected moduleInstanceList: InjectionModule[] = [];

	protected injectionMachine: InjectionMachine;

	constructor( moduleClassList: typeof InjectionModule[] = [] ) {
		this.moduleClassList = moduleClassList;
	}

	//
	// IMPLEMENTS
	//

	get started(): boolean { return this._started; }

	public start(): void {
		if ( this.started ) this.stop();
		this._started = true;
		this.injectionStart();
		this.applicationStart();

	}

	public stop(): void {
		this._started = false;
	}

	protected restart(): void {
		// 
	}



	//
	// DEPENDENCY INJECTION
	//

	protected injectionStart(): void {
		const list = this.injectionListGet();
		const injectionMachine = new InjectionMachine( list );
		injectionMachine.init();

		this.injectionMachine = injectionMachine;
	}

	protected injectionListGet(): InjectionModule[] {
		if ( !this.moduleInstanceList.length ) {
			this.moduleClassList.forEach( ModuleClass => this.moduleInstanceList.push( new ModuleClass() ) );
		}

		return this.moduleInstanceList;
	}



	//
	// APPLICATION
	//

	protected applicationStart(): void {
		this.injectionMachine.start( ApplicationType.APPLICATION );
	}

}