import Utils from "../Utils";
import { STYLE_LAYOUT, STYLE_RESOURCE, STYLE_SERVER, STYLE_STATE, STYLE_SYSTEM, STYLE_LOADER, STYLE_RESIZE, STYLE_APPLICATION, STYLE_DEPENDENCY } from "./LogStyles";

export default class Log extends Utils {

	public static m( ... args: any[] ): void {
		args.forEach( value => Log.message( value ) );
	}

	public static w( ... args: any[] ): void {
		args.forEach( value => Log.warn( value ) );
	}

	public static e( value: string ): void {
		Log.error( value );
	}


	//
	// MESSAGE
	//

	protected static message( value: string ): void {
		const list = Log.format( value );
		list.length === 1 ? console.log( list[ 0 ] ) : console.log.apply( this, list );
	}

	protected static warn( value: string ): void {
		const list = Log.format( value );
		list.length === 1 ? console.warn( list[ 0 ] ) : console.warn.apply( this, list );
	}

	protected static error( value: string ): void {
		const list = Log.format( value );
		list.length === 1 ? console.error( list[ 0 ] ) : console.error.apply( this, list );
		throw new Error( value );
	}


	//
	// FORMAT
	//

	protected static format( value: string ): any[] {
		if ( !value ) return [];

		const ERROR = Log.errorName( value );
		const STYLE = Log.styleGet( ERROR );

		return STYLE ? [ `%c${value}`, STYLE ] : [ value ];
	}

	protected static errorName( value: string ): string | undefined {
		const index = value.indexOf( ":" );
		const target = value.slice( 0, index );
		return index >= 0 ? target : undefined;
	}

	protected static styleGet( STYLE_NAME: string ): any {
		switch ( STYLE_NAME ) {
			case "APPLICATION": return STYLE_APPLICATION;
			case "DEPENDENCY_MACHINE": return STYLE_DEPENDENCY;
			case "DEPENDENCY": return STYLE_DEPENDENCY;
			case "SYSTEM": return STYLE_SYSTEM;
			case "LAYOUT": return STYLE_LAYOUT;
			case "STATE": return STYLE_STATE;
			case "RESOURCE": return STYLE_RESOURCE;
			case "SERVER": return STYLE_SERVER;
			case "LOADER": return STYLE_LOADER;
			case "RESIZE": return STYLE_RESIZE;
			default: return undefined;
		}
	}

}