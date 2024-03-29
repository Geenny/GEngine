import { injectable, inject } from "inversify";
import { ProcessState } from "core/modules/construction/process/state/state";
import { ID, NAME } from "data/types/common";
import { Log } from "utils/log";
import DependencyEvent from "./event/DependencyEvent";
import IDependency from "./interface/IDependency";
import IVODependency from "./interface/IVODependency";
import SubscriptionContainer from "core/modules/construction/subscription/SubscriptionContainer";

@injectable()
export default abstract class DependencyAbstract extends SubscriptionContainer implements IDependency {

    protected voSource: IVODependency;

    public get ID(): ID { return this.vo.ID; }

    public get name(): NAME { return this.vo.name || this.constructor.name; }

    public get isWorking(): boolean { return this.state === ProcessState.WORK; }

    public get vo(): IVODependency { return this.voSource; }

    protected processStart(): void {
        this.messageStart();
        this.dispatchStart();
    }

    protected processStop(): void {
        this.messageStop();
        this.dispatchStop();
    }


    //
    // COMPLETE
    //

    protected startComplete(): void {
        this.state = ProcessState.WORK;
        this.messageWorking();
    }

    protected stopComplete(): void {
        this.state = ProcessState.INIT;
        this.messageStop();
        this.dispatchStop();
    }


    //
    // DISPATCH
    //

    protected dispatchStart(): void {
        this.dispatchEvent( new DependencyEvent( DependencyEvent.START ) );
    }
    protected dispatchProgress(): void {
        this.dispatchEvent( new DependencyEvent( DependencyEvent.PROGRESS ) );
    }
    protected dispatchWorking(): void {
        this.dispatchEvent( new DependencyEvent( DependencyEvent.WORKING ) );
    }
    protected dispatchStop(): void {
        this.dispatchEvent( new DependencyEvent( DependencyEvent.STOP ) );
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