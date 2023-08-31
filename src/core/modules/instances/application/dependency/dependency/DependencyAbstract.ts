import { injectable, inject } from "inversify";
import VOContainer from "core/base/VOContainer";
import Log from "utils/log/Log";
import EventDispatcher from "../../event/EventDispatcher";
import ApplicationType from "../../types/ApplicationType";
import DependencyEvent from "./event/DependencyEvent";
import IDependency from "../interface/IDependency";
import IVODependency from "../interface/IVODependency";
import { DependencyState } from "./state/DependencyState";

@injectable()
export default abstract class DependencyAbstract extends VOContainer implements IDependency {

    @inject( ApplicationType.DISPATCHER )
    protected dispatcher: EventDispatcher;

    private _isWorking: boolean = false;
    private _state: number = DependencyState.STOPPED;

    public get ID(): number { return this.vo.id; }

    public get name(): string { return this.vo.name || this.constructor.name; }

    public get isWorking(): boolean { return this._isWorking; }

    public get vo(): IVODependency { return this.vo; }

    public get state(): number { return this._state || DependencyState.STOPPED }
    public set state( value: number ) {
        this._state = value;
        this._isWorking = value === DependencyState.WORKING;
    }

    public start(): void {
        if ( this.state === DependencyState.STOPPED ) {
            this.state = DependencyState.STARTING;

            this.messageStart();
            this.dispatchStart();
            this.startProcess();
        } else {
            Log.w( `DEPENDENCY: ${ this.name } an't be start right now!` );
        }
    }

    public stop(): void {
        if ( this.state === DependencyState.WORKING || 
            this.state === DependencyState.STARTING )
        {
            this.stopProcess();
        }

    }

    protected progress(): void {
        if ( this.state !== DependencyState.STARTING ) return;
        this.progressProcess();
        this.dispatchProgress();
    }


    //
    // PROCESS
    //

    protected startProcess(): void { }

    protected progressProcess(): void { }

    protected stopProcess(): void { }


    //
    // COMPLETE
    //

    protected startComplete(): void {
        this.state = DependencyState.WORKING;
        this.messageWorking();
    }

    protected stopComplete(): void {
        this.state = DependencyState.STOPPED;
        this.messageStop();
        this.dispatchStop();
    }


    //
    // DISPATCH
    //

    protected dispatchStart(): void {
        this.dispatcher.dispatchEvent( new DependencyEvent( DependencyEvent.START ) );
    }
    protected dispatchProgress(): void {
        this.dispatcher.dispatchEvent( new DependencyEvent( DependencyEvent.PROGRESS ) );
    }
    protected dispatchWorking(): void {
        this.dispatcher.dispatchEvent( new DependencyEvent( DependencyEvent.WORKING ) );
    }
    protected dispatchStop(): void {
        this.dispatcher.dispatchEvent( new DependencyEvent( DependencyEvent.STOP ) );
    }


    //
    // MESSAGE
    //

    protected messageStart(): void {
        Log.m( `DEPENDENCY: Start ${ this.name }!!!` );
    }
    protected messageWorking(): void {
        Log.m( `DEPENDENCY: ${ this.name } is working!!!` );
    }
    protected messageStop(): void {
        Log.m( `DEPENDENCY: ${ this.name } stop!!!` );
    }

}