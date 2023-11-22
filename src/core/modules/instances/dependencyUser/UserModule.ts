import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import User from "./main/User";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";

export default class RendererModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( User ).inSingletonScope().whenTargetNamed( "User" );

        return true;
    }

}