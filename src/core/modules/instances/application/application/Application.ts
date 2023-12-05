import { injectable, inject, named } from "inversify";
import IApplication from "./interface/IApplication";
import Log from "utils/log/Log";
import EventDispatcher from "core/machines/event/EventDispatcher";
import ApplicationOptions from "../options/ApplicationOptions";
import DependencyMachine from "../../dependency/main/DependencyMachine";
import { ApplicationType } from "../types/types";
import { DispatcherType } from "../../dispatcher/types/types";
import { DependencyType } from "../../dependency/types/types";
import VOContainer from "../../../construction/vo/VOContainer";

@injectable()
export default class Application extends VOContainer implements IApplication {

    @inject( DispatcherType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

    @inject( ApplicationType.OPTIONS )
    public options: ApplicationOptions;

    @inject( DependencyType.DEPENDENCY_MACHINE )
    public dependencyMachine: DependencyMachine;


    //
    // PROCESS
    //

    protected async onInit(): Promise<void> {
        await this.dependencyMachine.init();
    }

    protected async onStart(): Promise<void> {
        await this.dependencyMachine.start();
    }

    protected async onPause(): Promise<void> {
        await this.dependencyMachine.pause();
    }

    protected async onResume(): Promise<void> {
        await this.dependencyMachine.resume();
    }

    protected async onStop(): Promise<void> {
        await this.dependencyMachine.stop();
    }


    //
    // READY
    //

    protected onInitReady(): void {
        Log.m( "APPLICATION: Init!!!" );
    }

    protected onDestroyReady(): void {
        Log.m( "APPLICATION: Destroy!!!" );
    }

    protected onStartReady(): void {
        Log.m( "APPLICATION: Started!!!" );
    }

    protected onStopReady(): void {
        Log.m( "APPLICATION: Stop!!!" );
    }

    protected onPauseReady(): void {
        Log.m( "APPLICATION: Pause!!!" );
    }

    protected onResumeReady(): void {
        Log.m( "APPLICATION: Resume!!!" );
    }


}