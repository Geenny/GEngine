import { interfaces } from "inversify";
import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IDependencyMachine from "./main/interface/IDependencyMachine";
import IDependency from "./dependency/interface/IDependency";
import DependencyMachine from "./main/DependencyMachine";
import { IInjectionContainer } from "core/machines/injection";
import { DependencyType } from "./types/types";

export default class DependencyModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<IDependencyMachine>( DependencyType.DEPENDENCY_MACHINE ).to( DependencyMachine ).inSingletonScope();

        bind<interfaces.Factory<IDependency>>( DependencyType.DEPENDENCY_FACTORY ).toFactory( ( context ) => {
            return ( serviceId: interfaces.ServiceIdentifier<IDependency> ) => context.container.get( serviceId );
        });

        bind<interfaces.Factory<IDependency>>( DependencyType.DEPENDENCY_NAMED_FACTORY ).toFactory( ( context ) => {
            return ( name: string ) => context.container.getNamed( DependencyType.DEPENDENCY, name );
        });

        return true;
    }

}