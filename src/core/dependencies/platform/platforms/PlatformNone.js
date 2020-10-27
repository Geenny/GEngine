import PlatformEvent from "../event/PlatformEvent";
import PlatformAbstract from "./PlatformAbstract";

export default class PlatformNone extends PlatformAbstract {

    constructor( platform, parameters = null ) {
        super( platform, parameters );
    }


    //
    // PLATFORM
    //

    start() {
        this.apiInit();
    }
    stop() { }

    /**
     * Init
     */
    apiInit() {
        if ( this.started || this.starting ) return;
        this._starting = true;
        setTimeout( () => { this.apiOnInit(); }, 0 );
    }

    /**
     * Start
     */
    apiStart() {
        if ( !this.starting ) return;
        this.progressSet( 1 );
        this.apiOnStart();
        this.apiReady();
    }
    
    apiOnError( error ) {
        this.dispatchEvent( new PlatformEvent( PlatformEvent.ERROR, this.platform, { error } ) );
    }

    apiCheckReady() {
        if ( !this.starting || this.started ) return;
        this._starting = false;
        this._started = true;
        this.dispatchEvent( new PlatformEvent( PlatformEvent.READY, this.platform ) );
    }

    dataGet() {
        const data = localStorage.getItem( 'data' );
        try {
            this.data = JSON.parse( data );
        } catch ( error ) {}
        this.apiOnDataGet( this.data );
    }

    dataSet( data ) {
        this.data = data;
        localStorage.setItem( 'data', JSON.stringify( data ) );
        this.apiOnDataSet();
    }

}