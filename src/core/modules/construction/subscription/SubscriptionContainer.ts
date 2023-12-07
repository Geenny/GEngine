import { inject, injectable } from "inversify";
import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import IVOSubscriptionContainer from "./interface/IVOSubscriptionContainer";
import ISubscription from "./interface/ISubscription";
import ISubscriptionContainer from "./interface/ISubscriptionContainer";
import VOContainer from "../vo/VOContainer";
import { DispatcherType } from "core/modules/instances/dispatcher/types/types";
import Event from "core/machines/event/Event";

@injectable()
export default class SubscriptionContainer extends VOContainer implements ISubscriptionContainer {
	
    @inject( DispatcherType.DISPATCHER )
    dispatcher: IEventDispatcher;

	private _subscriptionList: ISubscription[] = [];

    protected voSource: IVOSubscriptionContainer;

	protected onAny: Function;

    public get vo(): IVOSubscriptionContainer { return this.voSource; }

	get subscriptionList(): ISubscription[] { return this._subscriptionList; }

	onMessage( event: Event ): void { }


	//
	// PROCESS
	//

	protected async onInit(): Promise<void> {
		await super.onInit();

		this.initSubscriptions();

		return Promise.resolve();
	}

	protected async onDestroy(): Promise<void> {
		await super.onDestroy();

		this.unsubscribe();

		return Promise.resolve();
	}


	//
	// 
	//

	protected inSubscriptionList( target: any ): boolean {
		return target && this._subscriptionList.some( subscription => subscription.name === target.name );
	}

	protected initSubscriptions(): void {
		if ( !this.vo?.subscriptions ) return;

		this.subscriptionsCreate();
		this.subscribe();
	}

	protected subscriptionsCreate(): void {
		if ( !Array.isArray( this.vo.subscriptions ) ) return;
		this.vo.subscriptions.forEach( name => this._subscriptionList.push( { name } ) );
	}


	//
	// HANDLE
	//

	protected onAnyAction( event: Event ): void {
		if ( !this.inSubscriptionList( event.target ) ) return;

		this.onMessage( event );
	}


	//
	// SUBSCRIBE / UNSCUBSCIBE
	//

	protected subscribe(): void {
		if ( !this.onAny ) this.onAny = this.onAnyAction.bind( this );
		this.dispatcher.addEventListener( Event.ANY, this.onAny );
	}

	protected unsubscribe(): void {
		if ( !this.onAny ) return;

		this.dispatcher.removeEventListener( Event.ANY, this.onAny );
		this.onAny = undefined;
	}

}