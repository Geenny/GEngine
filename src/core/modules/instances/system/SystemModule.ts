import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import SystemMachine from "./main/SystemMachine";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";

export default class SystemModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( SystemMachine ).inSingletonScope().whenTargetNamed( "SystemMachine" );

        return true;
    }

}