import { injectable, inject, interfaces } from "inversify";
import Log from "utils/log/Log";
import SubscriptionContainer from "core/modules/construction/subscription/SubscriptionContainer";
import Dependency from "../dependency/Dependency";
import IDependency from "../dependency/interface/IDependency";
import IDependencyMachine from "./interface/IDependencyMachine";
import IDependencyStruct from "../dependency/interface/IDependencyStruct";
import ApplicationOptions from "../../application/options/ApplicationOptions";
import { ApplicationType } from "../../application/types/types";
import { ViewObjectType } from "../../config/types/types";
import { DependencyType } from "../types/types";
import IVODependency from "../dependency/interface/IVODependency";
import IVODependencyMachine from "./interface/IVODependencyMachine";
import { WorkState } from "core/modules/construction/work/state/state";
import Event from "core/machines/event/Event";
import DependencyEvent from "../dependency/event/DependencyEvent";
import WorkEvent from "core/modules/construction/work/event/WorkEvent";
import Work from "core/modules/construction/work/Work";
import { PromiseStruct } from "data/promise/PromiseStruct";
import { SubscriptionStruct } from "data/subscription/SubscribeStruct";

@injectable()
export default class DependencyMachine extends SubscriptionContainer implements IDependencyMachine {

    @inject( ApplicationType.OPTIONS )
    protected options: ApplicationOptions;

    @inject( DependencyType.DEPENDENCY_NAMED_FACTORY )
    protected dependencyNameFactory: ( dependencyName: string ) => IDependency;

    protected voSource: IVODependencyMachine;

    protected promiseStructWork: PromiseStruct;

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
        this.promiseStructWork = this.promiseStructWorkCreate( WorkEvent.START );
        
        this.dependencyStartNext();

        await this.promiseStructWork.promise;
    }

    protected dependencyStartNext(): void {
        const readyIDs = this.dependencyStructList
            .filter( struct => struct.dependency.state === WorkState.WORK )
            .map( struct => struct.dependency.ID );
        
        const startList = this.dependencyStructList
            .filter( struct => struct.dependency.state === WorkState.INIT )
            .filter( struct => !this.dependencyProcessList.includes( struct.dependency ) )
            .filter( struct => this.isDependentEnough( struct.dependency, readyIDs ) );

        if ( startList.length || this.dependencyProcessList.length ) {
            startList.forEach( struct => this.dependencyStart( struct.dependency ) );
        } else {
            this.dependencyStartAllReady();
        }
    }

    protected isDependentEnough( dependency: IDependency, readyIDs: number[] ): boolean {
        if ( !dependency.vo.dependent || !Array.isArray( dependency.vo.dependent ) || dependency.vo.dependent.length === 0 )
            return true;

        return dependency.vo.dependent.every( value => readyIDs.includes( value ) );
    }

    protected dependencyInited( dependency: IDependency ): void {
        const struct = this.dependencyStructList.find( struct => struct.dependency === dependency );
        if ( struct ) struct.ready = true;
    }

    public dependencyStart( dependency: IDependency ): Promise<Work> {
        if ( dependency.state !== WorkState.INIT )
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
        if ( !this.promiseStructWork)
            return Log.e( `DEPENDENCY_MACHINE: ${ this.name }: Critical error!!! Work promise is lost!!!` );
        
        this.promiseStructWork.resolve();
        this.promiseStructWorkKill( WorkEvent.START );
    }


    //
    // DEPENDENCY STOP
    //

    protected async stopAll(): Promise<Work[]> {
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

    protected promiseStructWorkCreate( label: string = undefined): PromiseStruct {
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

    protected promiseStructWorkKill( label: string ): void {
        if ( this.promiseStructWork?.label !== label )
            return Log.e( `DEPENDENCY_MACHINE: ${ this.name }: Critical error!!! Work promise label are missed!!!` );
        
        this.promiseStructWork = undefined;
    }


    //
    // SUBSCRIPTION
    //

    protected dependencySubscribe( dependency: IDependency ): void {
        if ( this.dependecySubscriptionList.find( subscription => subscription.target === dependency ) ) return;

        const subscription = { any: this.onDependencyEventAny.bind( this ) }
        dependency.addEventListener( Event.ANY, subscription.any );
    }
    protected onDependencyEventAny( event: WorkEvent ): void {
        // @ts-ignore
        const dependency = this.dependencyList.find( dependency => dependency === event.target );
        switch( event.type ) {
            case WorkEvent.INITED: this.eventDependencyInited( dependency ); break;
            case WorkEvent.STARTED: this.eventDependencyStarted( dependency ); break;
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