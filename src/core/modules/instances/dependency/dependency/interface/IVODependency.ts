import IVOSubscriptionContainer from "core/modules/construction/subscription/interface/IVOSubscriptionContainer";

export default interface IVODependency extends IVOSubscriptionContainer {

    readonly dependent: number[];

}