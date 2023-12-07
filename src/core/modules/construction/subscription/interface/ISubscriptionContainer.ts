
import Event from "core/machines/event/Event";
import IVOContainer from "../../vo/interface/IVOContainer";
import ISubscription from "./ISubscription";
import IVOSubscriptionContainer from "./IVOSubscriptionContainer";

export default interface ISubscriptionContainer extends IVOContainer {

    readonly vo: IVOSubscriptionContainer;

	readonly subscriptionList: ISubscription[];

	onMessage( event: Event ): void;

}