import "reflect-metadata";
import {
	ViewObjectModule,
	ApplicationModule,
	DispatcherModule,
	DependencyModule,
	NetModule,
	PlatformModule,
	UserModule,
	RendererModule,
	SystemModule
} from "core/modules";
import { InjectionMachine, InjectionModule } from "../core/machines/injection";
import { ApplicationType } from "core/modules/instances/application/types/types";

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
		const viewObjectModule = new ViewObjectModule();
		const applicationModule = new ApplicationModule();
		const dispatcherModule = new DispatcherModule();
		const dependencyModule = new DependencyModule();
		const netModule = new NetModule();
		const platformModule = new PlatformModule();
		const userModule = new UserModule();
		const rendererModule = new RendererModule();
		const systemModule = new SystemModule();

		return [ viewObjectModule, dispatcherModule, applicationModule, dependencyModule, netModule, platformModule, userModule, rendererModule, systemModule ];
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