// import Application from "./core/application/Application";
// import IApplication from "./core/application/interface/IApplication";
import { InjectionMachine, InjectionModule } from "./core/machines/injection/";
import ApplicationModule from "./core/modules/application/ApplicationModule";

export default class Entry {

	private _started: boolean = false;

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

	protected injectionStart(): InjectionMachine {
		const list = this.injectionListGet();
		const injection = new InjectionMachine( list );
		injection.init();
		injection.start();

		return injection;
	}

	protected injectionListGet(): InjectionModule[] {
		// const element: IInjectionElement = {
		// 	name: "Application",
		// 	type: "bind",
		// 	symbol: Symbol.for("Application"),
		// 	// toInterface: IApplication,
		// 	toClass: Application
		// };

		// const element2: IInjectionElement = {
		// 	name: "EventDispathcer",
		// 	type: "bind",
		// 	symbol: Symbol.for("Application"),
		// 	// toInterface: IEventDispatcher,
		// 	toClass: EventDispatcher
		// }

		const applicationModule = new ApplicationModule();

		// const module: IInjectionModule = {
		// 	name: "Application",
		// 	list: [ applicationModule ]
		// };

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