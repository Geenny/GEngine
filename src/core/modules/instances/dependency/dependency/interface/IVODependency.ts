import IVOSubscriptionContainer from "core/modules/construction/subscription/interface/IVOSubscriptionContainer";
import { ID } from "data/types/common";

export default interface IVODependency extends IVOSubscriptionContainer {

    readonly dependent: ID[];

}