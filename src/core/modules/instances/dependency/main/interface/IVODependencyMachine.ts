import IVOSubscriptionContainer from "core/modules/construction/subscription/interface/IVOSubscriptionContainer";
import { ObjectListDependency } from "../../types/types";

export default interface IVODependencyMachine extends IVOSubscriptionContainer {

    readonly children: ObjectListDependency[];

}