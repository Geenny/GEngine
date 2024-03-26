import { injectable, inject, interfaces } from "inversify";
import SubscriptionContainer from "core/modules/construction/subscription/SubscriptionContainer";
import IDependency from "../dependency/interface/IDependency";
import IDependencyMachine from "./interface/IDependencyMachine";
import IDependencyStruct from "../dependency/interface/IDependencyStruct";
import ApplicationOptions from "../../application/options/ApplicationOptions";
import { ApplicationType } from "../../application/types/types";
import { DependencyType } from "../types/types";
import IVODependencyMachine from "./interface/IVODependencyMachine";
import { ProcessState } from "core/modules/construction/process/state/state";
import Event from "core/machines/event/Event";
import ProcessEvent from "core/modules/construction/process/event/ProcessEvent";
import Process from "core/modules/construction/process/Process";
import { PromiseStruct } from "data/promise/PromiseStruct";
import { SubscriptionStruct } from "data/subscription/SubscribeStruct";
import { ID } from "data/types/common";
import { Log } from "utils/log";

@injectable()
export default class DependencyMachine extends SubscriptionContainer implements IDependencyMachine {

    @inject( ApplicationType.OPTIONS )
    protected options: ApplicationOptions;

    @inject( DependencyType.DEPENDENCY_NAMED_FACTORY )
    protected dependencyNameFactory: ( dependencyName: string ) => IDependency;

    protected voSource: IVODependencyMachine;

    protected promiseStructProcess: PromiseStruct;

    protected dependencyList: IDependency[] = [];
    protected dependencyProcessList: IDependency[] = [];

    protected dependencyStructList: IDependencyStruct[] = [];

    protected dependecySubscriptionList: SubscriptionStruct[] = [];

    protected get dependencySourceList(): any[] { return this.vo?.children; }

    public get vo(): IVODependencyMachine { return this.voSource; }


    //
    // PROCESS
    //

    protected async onInit(): Promise<void> {
        await super.onInit();
        this.dependencyCreateAll();
        await this.dependencyInitAll();
        this.dependencyPrepareAll();
    }

    protected async onStart(): Promise<void> {
        await this.startAll();
    }

    protected async onStop(): Promise<void> {
        await this.stopAll();
    }


    //
    // DEPENDENCY CREATE
    //

    protected dependencyCreateAll(): void {
        if ( !this.dependencySourceList ) return;
        this.dependencySourceList.forEach( dependencyData => {
            const dependency = this.dependencyCreate( dependencyData.name );
            this.dependencyList.push( dependency );
        } );
    }

    protected dependencyCreate( dependencyName: string ): IDependency {
        return this.dependencyNameFactory( dependencyName );
    }


    //
    // DEPENDENCY INIT
    //

    protected dependencyInitAll(): Promise<unknown> {
        const promises = this.dependencyList.map( dependency => dependency.init() );
        return Promise.all(promises);
    }


    //
    // DEPENDENCY PREPARE
    //

    protected dependencyPrepareAll(): void {
        this.dependencyList.forEach( dependency => this.dependencyPrepare( dependency ) );
    }

    protected dependencyPrepare( dependency: IDependency ): void {
        this.dependencySubscribe( dependency );
        this.dependencyStructGet( dependency );
    }


    //
    // DEPENDENCY START
    //

    protected async startAll(): Promise<void> {
        await this.dependencyStartAll();
    }

    protected async dependencyStartAll(): Promise<void> {
        this.promiseStructProcess = this.promiseStructProcessCreate( ProcessEvent.START );
        
        this.dependencyStartNext();

        await this.promiseStructProcess.promise;
    }

    protected dependencyStartNext(): void {
        const readyNames = this.dependencyStructList
            .filter( struct => struct.dependency.state === ProcessState.WORK )
            .map( struct => struct.dependency.name );
        
        const startList = this.dependencyStructList
            .filter( struct => struct.dependency.state === ProcessState.INIT )
            .filter( struct => !this.dependencyProcessList.includes( struct.dependency ) )
            .filter( struct => this.isDependentEnough( struct.dependency, readyNames ) );

        if ( startList.length || this.dependencyProcessList.length ) {
            startList.forEach( struct => this.dependencyStart( struct.dependency ) );
        } else {
            this.dependencyStartAllReady();
        }
    }

    protected isDependentEnough( dependency: IDependency, readyNames: ID[] ): boolean {
        if ( !dependency.vo.dependent || !Array.isArray( dependency.vo.dependent ) || dependency.vo.dependent.length === 0 )
            return true;

        return dependency.vo.dependent.every( value => readyNames.includes( value ) );
    }

    protected dependencyInited( dependency: IDependency ): void {
        const struct = this.dependencyStructList.find( struct => struct.dependency === dependency );
        if ( struct ) struct.ready = true;
    }

    public dependencyStart( dependency: IDependency ): Promise<Process> {
        if ( dependency.state !== ProcessState.INIT )
            return;

        this.dependencyProcessListAdd( dependency );

        return dependency.start();
    }

    protected dependencyStarted( dependency: IDependency ): void {
        this.dependencyProcessListRemove( dependency );
        this.dependencyStartNext();
    }

    protected dependencyProcessListAdd( dependency: IDependency ): void {
        if ( this.dependencyProcessList.includes( dependency ) ) return;
        this.dependencyProcessList.push( dependency );
    }
    protected dependencyProcessListRemove( dependency: IDependency ): void {
        if ( !this.dependencyProcessList.includes( dependency ) ) return;
        const index = this.dependencyProcessList.indexOf( dependency );
        this.dependencyProcessList.splice( index, 1 );
    }

    protected dependencyStartAllReady(): void {
        if ( !this.promiseStructProcess)
            return Log.e( `DEPENDENCY_MACHINE: ${ this.name }: Critical error!!! Process promise is lost!!!` );
        
        this.promiseStructProcess.resolve();
        this.promiseStructProcessKill( ProcessEvent.START );
    }


    //
    // DEPENDENCY STOP
    //

    protected async stopAll(): Promise<Process[]> {
        const promises = this.dependencyList.map( dependency => dependency.stop() );
        return Promise.all(promises);
    }


    //
    // DEPENDENCY STRUCT
    //

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


    //
    // PROMISE
    //

    protected promiseStructProcessCreate( label: string = undefined): PromiseStruct {
        const promiseStruct: PromiseStruct = {
            label,
            resolve: undefined,
            reject: undefined,
            target: this
        };

        const promise = new Promise( ( resolve, reject ) => {
            promiseStruct.resolve = resolve;
            promiseStruct.reject = reject;
        });

        promiseStruct.promise = promise;

        return promiseStruct;
    }

    protected promiseStructProcessKill( label: string ): void {
        if ( this.promiseStructProcess?.label !== label )
            return Log.e( `DEPENDENCY_MACHINE: ${ this.name }: Critical error!!! Process promise label are missed!!!` );
        
        this.promiseStructProcess = undefined;
    }


    //
    // SUBSCRIPTION
    //

    protected dependencySubscribe( dependency: IDependency ): void {
        if ( this.dependecySubscriptionList.find( subscription => subscription.target === dependency ) ) return;

        const subscription = { any: this.onDependencyEventAny.bind( this ) }
        dependency.addEventListener( Event.ANY, subscription.any );
    }

    protected onDependencyEventAny( event: ProcessEvent ): void {
        // @ts-ignore
        const dependency = this.dependencyList.find( dependency => dependency === event.target );
        switch( event.type ) {
            case ProcessEvent.INITED: this.eventDependencyInited( dependency ); break;
            case ProcessEvent.STARTED: this.eventDependencyStarted( dependency ); break;
        }
    }


    //
    // HANDLER
    //

    protected eventDependencyInited( dependency: IDependency ): void {
        this.dependencyInited( dependency );
    }

    protected eventDependencyStarted( dependency: IDependency ): void {
        this.dependencyStarted( dependency );
        this.dependencyMessageStart( dependency );
    }


    //
    // MESSAGE
    //

    protected dependencyMessageStart( dependency: IDependency ): void {
        Log.m( `DEPENDENCY: ${ dependency.ID }: ${ dependency.name } started!!!` );
    }
    

}