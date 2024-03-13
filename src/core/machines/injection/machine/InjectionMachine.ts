import { Container, interfaces } from "inversify";
import getDecorators from "inversify-inject-decorators";
import IInjectionMachine from "../interface/IInjectionMachine";
import InjectionModule from "../module/InjectionModule";
import InjectionName from "../constants/InjectionName";
import IInjectionContainer from "../interface/IInjectionContainer";
import IInjectionContainerBinds from "../interface/IInjectionContainerBinds";
import containers from "./InjectionContainers";
import IProcess from "core/modules/construction/process/interface/IProcess";

export default class InjectionMachine implements IInjectionMachine {

    private _list: InjectionModule[] = [];
    private _inited: boolean = false;

    public get name(): string { return this.constructor.name; }
    public get list(): InjectionModule[] { return this._list || []; }
    public get inited(): boolean { return this._inited; }


    constructor( list?: InjectionModule[] ) {
        this._list = list || [];
    }

    public init() {
        if (this.inited) return;
        this._inited = true;

        this.containerInit();
        this.listInit();
    }

    // TEMP
    public start( serviceIdentifier: interfaces.ServiceIdentifier<unknown> ): void {
        const containerStruct = this.containerByIDGet( InjectionName.MAIN );
        const startInstance: IProcess = containerStruct.container.get( serviceIdentifier ) as IProcess;
        startInstance.init();
        startInstance.start();
    }


    //
    // CONTAINER
    //

    protected containerInit(): void {
        this.containerByIDCreate( InjectionName.MAIN );
    }

    protected containerByIDGet( containerID: string | undefined ) {
        if ( !containerID ) containerID = InjectionName.MAIN;

        const container = this.containerByIDFind( containerID ) || this.containerByIDCreate( containerID );
        
        return container;
    }

    protected containerByIDCreate( containerID: string = InjectionName.MAIN ): IInjectionContainer {
        const container = new Container();
        const binds = this.containerBindsGet( container );
        const decorators = getDecorators( container );
        const struct = { containerID, container, ... binds, ... decorators };

        containers[ containerID ] = struct;

        return struct;
    }

    protected containerByIDFind( containerID: string ): IInjectionContainer | undefined {
        for ( let name in containers ) {
            if ( name !== containerID ) continue;
            return containers[ name ];
        }
        return undefined;
    }

    protected containerBindsGet( container: Container ): IInjectionContainerBinds {
        return {
            isBound: (serviceIdentifier: interfaces.ServiceIdentifier<any>): boolean => container.isBound(serviceIdentifier),
            bind: <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> => container.bind<T>(serviceIdentifier),
            unbind: (serviceIdentifier: interfaces.ServiceIdentifier<any>): void => container.unbind(serviceIdentifier),
            rebind: <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> => container.rebind(serviceIdentifier)
        }
    }


    //
    // LIST
    //

    protected listInit(): void {
        this.list.map( module => {
            // if ( module.isInit ) return;
            this.injectModule( module );
        } );
    }

    protected listSet( list: InjectionModule[] ): InjectionModule[] {
        this._list = list;
        return this.list;
    }


    //
    // INJECTION
    //

    public injectModule( module: InjectionModule, containerID: string | undefined = undefined ): boolean {
        if ( !module ) return false;

        const containerStruct = this.containerByIDGet( module.containerID );

        return module.inject( containerStruct );
    }

}