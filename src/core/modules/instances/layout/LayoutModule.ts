import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";
import Layout from "./main/Layout";

export default class LayoutModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;
		
        bind<IDependency>( DependencyType.DEPENDENCY ).to( Layout ).inSingletonScope().whenTargetNamed( "Layout" );

        return true;
    }

}