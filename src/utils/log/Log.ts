export default class Log {

    public static l( ... args: any[] ) {
        console.log.apply( this, args );
        // args.forEach(object => {
        //     Log.__l(object)
        // })
    }

    public static error( ... args: any[] ) {
        if ( !Array.isArray( args ) ) return;
        if ( args.length > 0 ) {
            const errorList = args[ 0 ].split( "{value}" );
            let resultErrorLine = "";
            for ( let i = 0; i < errorList.length; i++ ) {
                resultErrorLine += errorList[ i ] + args[ i+1 ];
            }
            console.error( resultErrorLine );
        }
    }

    private static __l( object: any ) {
        console.log(object);
    }

}