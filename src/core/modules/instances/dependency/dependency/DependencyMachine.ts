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
import { WorkState } from "core/modules/construction/work/state/state";
import Event from "core/machines/event/Event";
import DependencyEvent from "./dependency/event/DependencyEvent";
import WorkEvent from "core/modules/construction/work/event/WorkEvent";
import Work from "core/modules/construction/work/Work";

@injectable()
export default class DependencyMachine extends VOContainer implements IDependencyMachine {

    @inject( ApplicationType.OPTIONS )
    protected options: ApplicationOptions;

    @inject( DependencyType.DEPENDENCY_NAMED_FACTORY )
    protected dependencyNameFactory: ( dependencyName: string ) => IDependency;

    protected voSource: IVODependencyMachine;

    protected dependencyList: IDependency[] = [];

    protected dependencyStructList: IDependencyStruct[] = [];

    protected get dependencySourceList(): any[] { return this.vo?.children; }

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
        const promisList = this.dependencyList.map( dependency => this.dependencyStart( dependency ) );
        await Promise.all( promisList );
    }

    public dependencyStart( dependency: IDependency ): Promise<Work> {
        if ( dependency.state === WorkState.NONE )
            dependency.init();

        this.dependencyStructGet( dependency );
        this.dependencySubscribe( dependency );

        return dependency.start();
    }

    protected dependencyStructGet( dependency: IDependency ): IDependencyStruct {
        return this.dependencyStructList.find( struct => struct.dependency === dependency )
            || this.dependencyStructCreate( dependency );
    }

    protected dependencyStructCreate( dependency: IDependency ): IDependencyStruct {
        const { ID, name, vo } = dependency;
        const struct: IDependencyStruct = { ID, name, vo, dependency };
        this.dependencyStructList.push( struct );
        return struct;
    }

    protected dependencySubscribe( dependency: IDependency ): void {
        const subscription = { any: this.onDependencyEventAny.bind( this ) }
        dependency.addEventListener( Event.ANY, subscription.any );
    }
    protected onDependencyEventAny( event: WorkEvent ): void {
        // @ts-ignore
        const dependency = this.dependencyList.find( dependency => dependency === event.target );
        switch( event.type ) {
            case WorkEvent.STARTED: this.dependencyMessageStart( dependency ); break;
        }
    }


    //
    // MESSAGE
    //

    dependencyMessageStart( dependency: IDependency ): void {
        Log.m( `DEPENDENCY: ${ dependency.ID }:${ dependency.name } started!!!` );
    }
    

}