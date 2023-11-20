import { injectable, inject } from "inversify";
import IApplication from "./interface/IApplication";
import VOContainer from "core/base/VOContainer";
import Log from "utils/log/Log";
import EventDispatcher from "core/machines/event/EventDispatcher";
import ApplicationOptions from "../options/ApplicationOptions";
import DependencyMachine from "../../dependency/dependency/DependencyMachine";
import { ApplicationType } from "../types/types";
import { DispatcherType } from "../../dispatcher/types/types";
import { DependencyType } from "../../dependency/types/types";

@injectable()
export default class Application extends VOContainer implements IApplication {

    @inject( DispatcherType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

    @inject( ApplicationType.OPTIONS )
    public options: ApplicationOptions;

    @inject( DependencyType.DEPENDENCY_MACHINE )
    public dependencyMachine: DependencyMachine;

    public init(): void {
        this.dependencyMachine.init();

        Log.m( "APPLICATION: Started!!!" );
    }

}