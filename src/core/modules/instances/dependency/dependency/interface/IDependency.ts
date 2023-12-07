import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import IVODependency from "./IVODependency";
import ISubscriptionContainer from "core/modules/construction/subscription/interface/ISubscriptionContainer";

export default interface IDependency extends ISubscriptionContainer {

    readonly ID: number;

    readonly name: string;

    readonly vo: IVODependency;

    readonly isWorking: boolean;

    dispatcher: IEventDispatcher;

}