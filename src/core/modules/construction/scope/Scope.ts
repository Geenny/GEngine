import IScopeChild from "./interface/IScopeChild";
import IScope from "./interface/IScope";

export default class Scope implements IScope {

	protected list: IScopeChild[] = [];

	get length(): number { return this.list.length; }

	index( key: any ): number {
		return this.list.findIndex( struct => struct.target === key && struct.target?.ID === key || struct.target?.name === key );
	}

	exist( key: any ): boolean {
		return this.index( key ) >= 0;
	}

	get( key: any ): IScopeChild | undefined {
		return this.list.find( struct => struct.target === key && struct.target?.ID === key || struct.target?.name === key );
	}

	add( target: any ): boolean {
		let struct = this.get( target );
		if ( struct ) return false;

		
		return this.addChild( target );
	}

	addMulti( target: any ): boolean {
		return this.addChild( target );
	}

	remove( target: any ): boolean {
		return this.removeChild( target );
	}

	removeAll(): void {
		while ( this.list.length ) {
			const struct = this.list.shift();
			this.removeHandle( struct );
			this.structFromListRemove( struct );
		}
	}


	//
	// CHILD
	//

	protected structCreate( target: any ): IScopeChild {
		return { target };
	}

	protected addChild( target: any ): boolean {
		const struct = this.structCreate( target );
		this.structToListAdd( struct );
		this.addHandle( struct );
		return true;
	}

	protected removeChild( target: any ): boolean {
		let isSomeRemove = false;

		while ( true ) {
			const index = this.index( target );
			const struct = this.list[ index ];
			if ( !struct ) break;

			this.removeHandle( struct );
			this.structFromListRemove( struct );

			isSomeRemove = true;
		}

		return isSomeRemove;
	}


	//
	// LIST
	//

	protected structToListAdd( struct: IScopeChild ): void {
		this.list.push( struct );
	}
	protected structFromListRemove( struct: IScopeChild ): number {
		const index = this.index( struct.target );
		this.list.splice( index, 1 );
		return index;
	}


	//
	// HANDLE
	//

	protected addHandle( struct: IScopeChild ): void { }

	protected removeHandle( struct: IScopeChild ): void { }



}