import { Container } from "inversify";
import ApplicationType from "./types/ApplicationType";
import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IApplication from "./application/interface/IApplication";
import IEventDispatcher from "./event/interface/IEventDispatcher";
import IApplicationOptions from "./options/interface/IApplicationOptions";
import IDependencyMachine from "./dependency/interface/IDependencyMachine";
import Application from "./application/Application";
import EventDispatcher from "./event/EventDispatcher";
import ApplicationOptions from "./options/ApplicationOptions";
import DependencyMachine from "./dependency/DependencyMachine";
import { IInjectionContainer } from "core/machines/injection";

export default class ApplicationModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { container, bind } = containerStruct;

        container.getNamed

        bind<IApplicationOptions>( ApplicationType.OPTIONS ).to( ApplicationOptions ).inSingletonScope();
        bind<IEventDispatcher>( ApplicationType.DISPATCHER ).to( EventDispatcher ).inSingletonScope();
        bind<IDependencyMachine>( ApplicationType.DEPENDENCY_MACHINE ).to( DependencyMachine ).inSingletonScope();
        bind<IApplication>( ApplicationType.APPLICATION ).to( Application ).inSingletonScope();

        return true;
    }

}