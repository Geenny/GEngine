import IVO from "../../vo/interface/IVO";

export default interface IVOSubscriptionContainer extends IVO {

	readonly subscriptions: string[];

}