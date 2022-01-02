import IWork from "./typescript/utils/common/interface/IWork";

export default class Entry implements IWork {

	private _started: boolean = false;

	//
	// IMPLEMENTS
	//

	get started(): boolean {
		return this._started;
	}

	public start(): void {
		if ( this.started ) this.stop();
		this._started = true;
		// this.applicationStart();
	}

	public stop(): void {
		this._started = false;
	}

	protected restart(): void {
		// if ( !this.started )
	}



	//
	// APPLICATION
	//

	// protected applicationStart() {
	//     if ( window.ge_app ) return window.ge_app;

	//     const ApplicationClass = this.ApplicationClass || Application;
	//     const application = new ApplicationClass( this.applicationVO );
	//     application.init();
	//     window.ge_app = application;

	//     return application;
	// }

	// protected applicationRestart() {
	//     if ( window.ge_app ) {
	//         window.ge_app.destroy();
	//         window.ge_app = null;
	//     }

	//     return this.applicationStart();
	// }

}