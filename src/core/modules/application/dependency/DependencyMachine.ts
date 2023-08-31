import { injectable, inject } from "inversify";
import IWork from "../../../../data/worker/IWork";
import VOContainer from "../../../base/VOContainer";
import Log from "../log/Log";
import ApplicationOptions from "../options/ApplicationOptions";
import ApplicationType from "../types/ApplicationType";
import Dependency from "./dependency/Dependency";
import IDependency from "./interface/IDependency";
import IDependencyMachine from "./interface/IDependencyMachine";
import IDependencyStruct from "./interface/IDependencyStruct";

@injectable()
export default class DependencyMachine extends VOContainer implements IDependencyMachine {

    @inject( ApplicationType.OPTIONS )
    protected options: ApplicationOptions;

    @inject( ApplicationType.LOG )
    protected log: Log;

    protected dependencyList: IDependency[] = [];

    protected dependencyStructList: IDependencyStruct[] = [];

    init(): void { }


    //
    // DEPENDENCY
    //

    
    public startAll(): void { }

    public start( dependecyName: string ): void {
        // verify
    }

    public stop(): void { }


    public dependencyStart( name: string ): boolean {
        const dependency: IDependency = this.dependencyGet( name );
        dependency && dependency.start();
        return !!dependency;
    }

    protected dependencyGet( name: string ): IDependency | undefined {
        let struct: IDependencyStruct = this.dependencyStructFind( name );
        if ( !struct ) return undefined;

        if ( !struct.dependency ) this.dependencyCreate( struct );
        return struct.dependency;
    }

    protected dependencyCreate( struct: IDependencyStruct ): IDependency | undefined {
        const DependencyClass = struct.vo.class;
        const dependency: Dependency = new DependencyClass();

        dependency.voBySourceSet( struct.vo );

        return dependency;
    }

    protected dependencyStructFind( name: string ): IDependencyStruct | undefined {
        const struct: IDependencyStruct = this.dependencyStructList.find( struct => struct.name === name );
        if ( !struct ) this.log.warn( "DependencyMachine: %s not present, and can't be finded!!!", name );
        return struct;
    }

}