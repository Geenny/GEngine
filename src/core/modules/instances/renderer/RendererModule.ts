import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependency from "../dependency/dependency/interface/IDependency";
import Renderer from "./main/Renderer";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "../dependency/types/types";

export default class RendererModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependency>( DependencyType.DEPENDENCY ).to( Renderer ).inSingletonScope().whenTargetNamed( "Renderer" );

        return true;
    }

}