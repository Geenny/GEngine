import InjectionModule from "../../../machines/injection/module/InjectionModule";
import Net from "./main/Net";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";
import IDependency from "../dependency/dependency/interface/IDependency";

export default class NetModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( Net ).inSingletonScope().whenTargetNamed( "Net" );

        return true;
    }

}