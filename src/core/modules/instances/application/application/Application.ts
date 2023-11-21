import { injectable, inject, named } from "inversify";
import IApplication from "./interface/IApplication";
import Log from "utils/log/Log";
import EventDispatcher from "core/machines/event/EventDispatcher";
import ApplicationOptions from "../options/ApplicationOptions";
import DependencyMachine from "../../dependency/dependency/DependencyMachine";
import { ApplicationType } from "../types/types";
import { DispatcherType } from "../../dispatcher/types/types";
import { DependencyType } from "../../dependency/types/types";
import VOContainer from "../../../construction/vo/VOContainer";
import IVO from "../../../construction/vo/interface/IVO";
import { ViewObjectType } from "../../config/types/types";

@injectable()
export default class Application extends VOContainer implements IApplication {

    @inject( DispatcherType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

    @inject( ApplicationType.OPTIONS )
    public options: ApplicationOptions;

    @inject( DependencyType.DEPENDENCY_MACHINE )
    public dependencyMachine: DependencyMachine;

    protected processInit(): void {
        this.dependencyMachine.init();
        
        Log.m( "APPLICATION: Init!!!" );

        this.readyInit();
    }

}