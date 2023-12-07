import IVOSubscriptionContainer from "core/modules/construction/subscription/interface/IVOSubscriptionContainer";

export default interface IVODependencyMachine extends IVOSubscriptionContainer {

    readonly children: any[];

}