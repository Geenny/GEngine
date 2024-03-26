import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";
import Sounds from "./main/Sounds";

export default class SoundModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;
		
        bind<IDependency>( DependencyType.DEPENDENCY ).to( Sounds ).inSingletonScope().whenTargetNamed( "Sounds" );

        return true;
    }

}