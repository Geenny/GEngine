import { injectable, inject, named } from "inversify";
import IWork from "data/worker/IWork";
import Log from "utils/log/Log";
import VOContainer from "../../../construction/vo/VOContainer";
import Dependency from "./dependency/Dependency";
import IDependency from "./interface/IDependency";
import IDependencyMachine from "./interface/IDependencyMachine";
import IDependencyStruct from "./interface/IDependencyStruct";
import ApplicationOptions from "../../application/options/ApplicationOptions";
import IVO from "../../../construction/vo/interface/IVO";
import { ApplicationType } from "../../application/types/types";
import { ViewObjectType } from "../../config/types/types";

@injectable()
export default class DependencyMachine extends VOContainer implements IDependencyMachine {

    @inject( ApplicationType.OPTIONS )
    protected options: ApplicationOptions;

    protected dependencyList: IDependency[] = [];

    protected dependencyStructList: IDependencyStruct[] = [];


    //
    // PROCESS
    //

    protected processStart(): void {
        this.startAll();
    }

    protected processStop(): void {

    }


    //
    // DEPENDENCY
    //
    
    public startAll(): void { }


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

        // dependency.voBySourceSet( struct.vo );

        return dependency;
    }

    protected dependencyStructFind( name: string ): IDependencyStruct | undefined {
        const struct: IDependencyStruct = this.dependencyStructList.find( struct => struct.name === name );
        if ( !struct ) Log.w( "DEPENDENCY_MACHINE: %s not present, and can't be finded!!!", name );
        return struct;
    }

}