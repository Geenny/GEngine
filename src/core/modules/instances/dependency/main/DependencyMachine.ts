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

    protected promiseStructGlobal: PromiseStruct;

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
        this.promiseStructGlobal = this.promiseStructGlobaleCreate();

        this.dependencyStartAll();

        await this.promiseStructGlobal.promise;
    }

    protected dependencyStartAll(): void {
        this.dependencyPrepareAll();

        if ( this.dependencyInitedAllReadyCheck() )
            this.dependencyInitedAllReady();
    }

    protected dependencyPrepareAll(): void {
        this.dependencyList.forEach( dependency => this.dependencyPrepare( dependency ) );
    }

    protected dependencyPrepare( dependency: IDependency ): IDependencyStruct {
        if ( dependency.state === WorkState.NONE )
            dependency.init();

        this.dependencySubscribe( dependency );
        return this.dependencyStructGet( dependency );
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

        if ( this.dependencyInitedAllReadyCheck() )
            this.dependencyInitedAllReady();
    }

    protected dependencyInitedAllReadyCheck(): boolean {
        return this.dependencyStructList.every( struct => struct.ready && struct.dependency.state !== WorkState.NONE );
    }

    protected dependencyInitedAllReady(): void {
        this.dependencyStartNext();
    }

    public dependencyStart( dependency: IDependency ): Promise<Work> {
        if ( dependency.state !== WorkState.INIT ) {
            debugger;
            return;
        }

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
        if ( !this.promiseStructGlobal) {
            debugger;
            return;
        }
        
        this.promiseStructGlobal.resolve();
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

    protected promiseStructGlobaleCreate(): PromiseStruct {
        const promiseStruct: PromiseStruct = {
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
        Log.m( `DEPENDENCY: ${ dependency.ID }:${ dependency.name } started!!!` );
    }
    

}