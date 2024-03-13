export default interface IScope {

	index( target: any ): number;

	exist( target: any ): boolean;

	get( key: any ): any | undefined;

	add( target: any ): boolean;

	addMulti( target: any ): boolean;

	remove( target: any ): boolean;

	removeAll(): void;

}