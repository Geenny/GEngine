import { PromiseStatusStruct } from "./PromiseStatusStruct";
import { PromiseStruct } from "./PromiseStruct";

export default class PromiseProcessor {

	protected list: PromiseStatusStruct[] = [];

	get length(): number { return this.list.length; }

	exist( status: string ): boolean {
		return !!this.list.find( data => data.status === status );
	}

	add( status: string, struct: PromiseStruct ): boolean {
		if ( !status || !struct ) return false;
		if ( this.exist( status ) ) return false;

		this.list.push( { status, struct } );

		return true;
	}

	remove( status: string ): PromiseStatusStruct | undefined {
		const statusStruct = this.list.find( data => data.status === status );
		if ( !statusStruct ) return;

		const index = this.list.indexOf( statusStruct );
		this.list.splice( index, 1 );

		return statusStruct;
	}

	shift(): PromiseStatusStruct | undefined {
		if ( this.length === 0 ) return undefined;
		return this.list.shift();
	}

}