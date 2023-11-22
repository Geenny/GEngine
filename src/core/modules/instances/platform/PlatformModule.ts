import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IPlatform from "./platform/interface/IPlatform";
import Platform from "./platform/Platform";
import { IInjectionContainer } from "core/machines/injection";
import { PlatformType } from "./types/types";
import { DependencyType } from "../dependency/types/types";
import IDependency from "../dependency/dependency/interface/IDependency";

export default class PlatformModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( Platform ).whenTargetNamed( "Platform" );

        return true;
    }

}