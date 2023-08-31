import { injectable, inject } from "inversify";
import IApplication from "./interface/IApplication";
import VOContainer from "core/base/VOContainer";
import ApplicationType from "../types/ApplicationType";
import EventDispatcher from "../event/EventDispatcher";
import ApplicationOptions from "../options/ApplicationOptions";
import DependencyMachine from "../dependency/DependencyMachine";
import Log from "utils/log/Log";

@injectable()
export default class Application extends VOContainer implements IApplication {

    @inject( ApplicationType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

    @inject( ApplicationType.OPTIONS )
    public options: ApplicationOptions;

    @inject( ApplicationType.DEPENDENCY_MACHINE )
    public dependencyMachine: DependencyMachine;

    public init(): void {
        this.dependencyMachine.init();

        Log.m( "APPLICATION: Started!!!" );
    }

}