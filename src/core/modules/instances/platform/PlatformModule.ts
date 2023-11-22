import InjectionModule from "../../../machines/injection/module/InjectionModule";
import Platform from "./platform/Platform";
import IDependency from "../dependency/dependency/interface/IDependency";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";

export default class PlatformModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( Platform ).inSingletonScope().whenTargetNamed( "Platform" );

        return true;
    }

}