import { Container } from "inversify";
import InjectionModule from "../../machines/injection/module/InjectionModule";
import IApplication from "./application/interface/IApplication";
import IEventDispatcher from "./event/interface/IEventDispatcher";
import IApplicationOptions from "./options/interface/IApplicationOptions";
import ILog from "./log/interface/ILog";
import ApplicationType from "./types/ApplicationType";
import Application from "./application/Application";
import EventDispatcher from "./event/EventDispatcher";
import ApplicationOptions from "./options/ApplicationOptions";
import Log from "./log/Log";
import IDependencyMachine from "./dependency/interface/IDependencyMachine";
import DependencyMachine from "./dependency/DependencyMachine";

export default class ApplicationModule extends InjectionModule {

    protected injectElements(container: Container): boolean {

        container.bind<IApplication>( ApplicationType.APPLICATION ).to(Application);
        container.bind<IEventDispatcher>( ApplicationType.DISPATCHER ).to(EventDispatcher);
        container.bind<IApplicationOptions>( ApplicationType.OPTIONS ).to(ApplicationOptions);
        container.bind<ILog>( ApplicationType.LOG ).to(Log);
        container.bind<IDependencyMachine>( ApplicationType.DEPENDENCY_MACHINE ).to(DependencyMachine);

        return true;
    }

}