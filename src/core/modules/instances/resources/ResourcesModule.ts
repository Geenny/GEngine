import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";
import Resources from "./main/Resources";

export default class ResourcesModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;
		
        bind<IDependency>( DependencyType.DEPENDENCY ).to( Resources ).inSingletonScope().whenTargetNamed( "Resources" );

        return true;
    }

}