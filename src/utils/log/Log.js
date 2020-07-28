export default class Log {

    static l(... args) {
        args.forEach(object => {
            Log.__l(object)
        })
    }

    static error( ...args ) {
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

    static __l(object) {
        console.log(object)
    }

}