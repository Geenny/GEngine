import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependencyMachine from "./dependency/interface/IDependencyMachine";
import DependencyMachine from "./dependency/DependencyMachine";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "./types/types";

export default class DependencyModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependencyMachine>( DependencyType.DEPENDENCY_MACHINE ).to( DependencyMachine ).inSingletonScope();

        return true;
    }

}