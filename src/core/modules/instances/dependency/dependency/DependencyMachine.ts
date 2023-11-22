import { injectable, inject, interfaces } from "inversify";
import Log from "utils/log/Log";
import VOContainer from "../../../construction/vo/VOContainer";
import Dependency from "./dependency/Dependency";
import IDependency from "./interface/IDependency";
import IDependencyMachine from "./interface/IDependencyMachine";
import IDependencyStruct from "./interface/IDependencyStruct";
import ApplicationOptions from "../../application/options/ApplicationOptions";
import { ApplicationType } from "../../application/types/types";
import { ViewObjectType } from "../../config/types/types";
import { DependencyType } from "../types/types";
import IVODependency from "./interface/IVODependency";
import IVODependencyMachine from "./interface/IVODependencyMachine";

@injectable()
export default class DependencyMachine extends VOContainer implements IDependencyMachine {

    @inject( ApplicationType.OPTIONS )
    protected options: ApplicationOptions;

    // @inject( DependencyType.DEPENDENCY )
    // protected dependencyFactory: ( identifier: interfaces.ServiceIdentifier<IDependency> ) => IDependency;

    @inject( DependencyType.DEPENDENCY_NAMED_FACTORY )
    protected dependencyNameFactory: ( dependencyName: string ) => IDependency;

    protected voSource: IVODependencyMachine;

    protected dependencyList: IDependency[] = [];

    protected dependencyStructList: IDependencyStruct[] = [];

    protected get dependencySourceList(): any[] { return this.vo?.dependencyList; }

    public get vo(): IVODependencyMachine { return this.voSource; }


    //
    // PROCESS
    //

    protected async onInit(): Promise<void> {
        await super.onInit();
        this.dependencyInit();
    }

    protected async onStart(): Promise<void> {
        await this.startAll();
    }
    protected async onStop(): Promise<void> {
        // this.startAll();
        debugger;
    }


    //
    // DEPENDENCY
    //

    protected dependencyInit(): void {
        if ( !this.dependencySourceList ) return;
        this.dependencySourceList.forEach( dependencyData => {
            const dependency = this.dependencyNameFactory( dependencyData.name );
            this.dependencyList.push( dependency );
        } );
    }
    
    public async startAll(): Promise<void> {
        this.dependencyList.forEach( dependency => {
            dependency.init();
            dependency.start();
        } );
    }


    public dependencyStart( name: string ): boolean {
        const dependency: IDependency = this.dependencyGet( name );
        // dependency && dependency.start();
        return !!dependency;
    }

    protected dependencyGet( name: string ): IDependency | undefined {
        let struct: IDependencyStruct = this.dependencyStructFind( name );
        if ( !struct ) return undefined;

        if ( !struct.dependency ) this.dependencyCreate( struct );
        return struct.dependency;
    }

    protected dependencyCreate( struct: IDependencyStruct ): IDependency | undefined {
        // const DependencyClass = struct.vo.class;
        // const dependency: Dependency = new DependencyClass();

        // dependency.voBySourceSet( struct.vo );

        // return dependency;
        return undefined;
    }

    protected dependencyStructFind( name: string ): IDependencyStruct | undefined {
        const struct: IDependencyStruct = this.dependencyStructList.find( struct => struct.name === name );
        if ( !struct ) Log.w( "DEPENDENCY_MACHINE: %s not present, and can't be finded!!!", name );
        return struct;
    }

}