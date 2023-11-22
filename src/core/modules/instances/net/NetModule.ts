import InjectionModule from "../../../machines/injection/module/InjectionModule";
import Net from "./net/Net";
import INet from "./net/interfaces/INet";
import { IInjectionContainer } from "core/machines/injection";
import { NetType } from "./types/types";
import { DependencyType } from "../dependency/types/types";
import IDependency from "../dependency/dependency/interface/IDependency";

export default class NetModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( Net ).whenTargetNamed( "Net" );

        return true;
    }

}