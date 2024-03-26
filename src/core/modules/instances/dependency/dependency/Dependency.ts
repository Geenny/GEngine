import { injectable, inject } from "inversify";
import DependencyAbstract from "./DependencyAbstract";
import { Log } from "utils/log";

@injectable()
export default class Dependency extends DependencyAbstract {

    protected async onStart(): Promise<void> {
        super.onStart();
    }
    protected async onStop(): Promise<void> {
        super.onStop();
    }

    //
    // READY
    //

    // protected onStartReady(): void {
    //     Log.m( `DEPENDENCY: Started ${ this.name }!!!` );
    // }
    // protected onStopReady(): void {
    //     Log.m( `DEPENDENCY: Stopped ${ this.name }!!!` );
    // }

}