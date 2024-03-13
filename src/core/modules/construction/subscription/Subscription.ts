import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import ISubscriptioStruct from "./interface/ISubscriptionStruct";
import { ObjectListMethod } from "data/types/common";

export default class Subscription {

	protected list: ISubscriptioStruct[] = [];

	index( target: IEventDispatcher ): number {
		return this.list.findIndex( struct => struct.target === target );
	}

	exist( target: IEventDispatcher ): boolean {
		return !!this.get( target );
	}

	get( target: IEventDispatcher ): ISubscriptioStruct {
		return this.list.find( struct => struct.target === target );
	}

	add( target: IEventDispatcher, methods: ObjectListMethod, isSingleSubscribe: boolean = true ): ISubscriptioStruct {
		let struct = this.get( target );
		if ( isSingleSubscribe && struct ) return struct;
		
		return this.addTarget( target, methods );
	}

	remove( target: IEventDispatcher ): boolean {
		return this.removeTarget( target );
	}


	//
	// CREATE
	//

	protected addTarget( target: IEventDispatcher, methods: ObjectListMethod ): ISubscriptioStruct {
		const struct = { target, methods };

		this.createSubscribes( target, methods );

		this.list.push( struct );

		return struct;
	}

	protected createSubscribes( target: IEventDispatcher, methods: ObjectListMethod ): void {
		Object.keys( methods ).forEach( key => {
			const method = methods[ key ];
			target.addEventListener( key, method );
		} );
	}


	//
	// 
	//

	protected removeTarget( target: IEventDispatcher ): boolean {
		let isSomeRemove = false;

		while ( true ) {
			const index = this.index( target );
			const struct = this.list[ index ];
			if ( !struct ) break;

			this.unsubscribes( target, struct.methods );
			this.list.splice( index, 1 );

			isSomeRemove = true;
		}

		return isSomeRemove;
	}

	protected unsubscribes( target: IEventDispatcher, methods: ObjectListMethod ): void {
		Object.keys( methods ).forEach( key => {
			const method = methods[ key ];
			target.addEventListener( key, method );
		} );
	}

}