import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";
import LoaderManager from "./main/LoaderManager";

export default class LoaderManagerModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;
		
        bind<IDependency>( DependencyType.DEPENDENCY ).to( LoaderManager ).inSingletonScope().whenTargetNamed( "LoaderManager" );

        return true;
    }

}