import "reflect-metadata";
import { ApplicationModule } from "core/modules";
import { InjectionMachine, InjectionModule } from "./core/machines/injection/";
import ApplicationType from "core/modules/instances/application/types/ApplicationType";

export default class Entry {

	private _started: boolean = false;

	protected injectionMachine: InjectionMachine;

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
		// if ( !this.started )
	}



	//
	// DEPENDENCY INJECTION
	//

	protected injectionStart(): void {
		const list = this.injectionListGet();
		const injectionMachine = new InjectionMachine( list );
		injectionMachine.init();
		injectionMachine.start( ApplicationType.APPLICATION );

		this.injectionMachine = injectionMachine;
	}

	protected injectionListGet(): InjectionModule[] {
		const applicationModule = new ApplicationModule();

		return [ applicationModule ];
	}



	//
	// APPLICATION
	//

	protected applicationStart(): void {
	    // if ( window.gg ) return window.gg;



	    // const ApplicationClass = this.ApplicationClass;
	    // const application = new ApplicationClass();
	    // application.init();
	    // window.gg = application;

	    // return application;
	}

	// protected applicationRestart() {
	//     // if ( window.gg ) {
	//     //     window.gg.destroy();
	//     //     window.gg = null;
	//     // }

	//     return this.applicationStart();
	// }

	// protected get ApplicationClass(): any { return Application; }

}