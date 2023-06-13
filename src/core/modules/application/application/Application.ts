import { injectable, inject } from "inversify";
import IApplication from "./interface/IApplication";
import VOContainer from "../../../base/VOContainer";
import ApplicationType from "../types/ApplicationType";
import EventDispatcher from "../event/EventDispatcher";
import ApplicationOptions from "../options/ApplicationOptions";
import Log from "../log/Log";
import DependencyMachine from "../dependency/DependencyMachine";

@injectable()
export default class Application extends VOContainer implements IApplication {

    @inject( ApplicationType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

    @inject( ApplicationType.OPTIONS )
    public options: ApplicationOptions;

    @inject( ApplicationType.LOG )
    public log: Log;

    @inject( ApplicationType.DEPENDENCY_MACHINE )
    public dependencyMachine: DependencyMachine;

    public init(): void {
        this.dependencyMachine.init();

        this.log.log( "%c Application: Started!!!", this.log.style.APPLICATION );
    }

}