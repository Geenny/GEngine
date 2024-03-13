import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import IVODependency from "./IVODependency";
import ISubscriptionContainer from "core/modules/construction/subscription/interface/ISubscriptionContainer";
import { ID } from "data/types/common";

export default interface IDependency extends ISubscriptionContainer {

    readonly ID: ID;

    readonly name: string;

    readonly vo: IVODependency;

    readonly isWorking: boolean;

    dispatcher: IEventDispatcher;

}