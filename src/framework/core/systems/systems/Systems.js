import EventDispathcer from "../../machines/event/EventDispatcher";
import SystemsVO from "./vo/SystemsVO";

export default class Systems extends EventDispathcer {

    static init( systemsVO = new SystemsVO() ) {
        if ( !Systems._instance ) {
            Systems._instance = new Systems( systemsVO );
        }
        return Systems._instance;
    }

    static get instance() {
        if ( !Systems._instance ) {
            Systems._instance = new Systems()
        }
    }

    constructor( systemsVO = new SystemsVO() ) {

        super();

        // this.initVars();
        this.initVO( systemsVO );

    }

    //
    // GET/SET
    //

    get systems() { return this.vo.systems; }
    get systemsSourceList() { return this.vo.systemsSourceList; }


    //
    // INIT
    //

    init() {
        this.systemsStop();
        this.systemsStart();
    }
    initVO( vo ) {
        this.vo = vo;
    }


    //
    // SYSTEMS
    //

    /**
     * 
     */
    systemsStart() {
        for ( const source in this.systemsSourceList ) {
            const system = this.systemAddFromSource( source );
            this._systemStart( system );
        }
    }

    systemsStop() {
        for ( const system in this.systems ) {
            this._systemStop( system );
        }
    }



    //
    // SYSTEM
    //

    /**
     * 
     * @param {System} systemSource 
     */
    systemAddFromSource( systemSource ) {

        const system = this._systemCreate( systemSource );

        if ( system ) {
            this.vo.systems.push( system );
            this.vo.systemsSourceList.push( {
                system,
                systemSource
            } );
            return system;
        }

        return null;

    }

    /**
     * 
     * @param {System} system 
     */
    systemInList( system ) {
        return system && this.systems.indexOf( system ) != -1;
    }

    _systemStart( system ) {

        if ( !system ) return;
        if ( system.isStarted ) return;
        if ( !this.systemInList( system ) )
            this.systemAdd( system );
        
        system.start();
    }

    _systemStop( system ) {

        if ( !system ) return;
        if ( !system.isStarted ) return;
        if ( !this.systemInList( system ) ) return;

        system.stop();
        
    }

    _systemAdd( system ) {

        system.addEventListsner( Event.ANY, this._onSystemEvent );
        this.systems.push( system );

    }

    _systemCreate( systemSource ) {

        if ( !systemSource.class ) return null;
        
        try {
            const SystemClass = systemSource.class;
            const systemVO = new SystemVO( systemSource.options );
            const system = new SystemClass( systemVO );
            return system;
        } catch ( error ) {}

        return null;

    }

    _systemDestroy( system ) {

        this._systemStop( system );

        let index = this.vo.systems.indexOf( system );
        if ( index >= 0) {
            this.vo.systems.splice( index, 1 );
        }
        
        index = this.vo.systemsSourceList.length;
        while ( --index >= 0 ) {
            const object = this.vo.systemsSourceList[ index ];
            if ( object.system ) {
                this.vo.systemsSourceList.splice( index, 1 );
            }
        }
        
    }


    //
    // EVENTS
    //

    _onSystemEvent( event ) {

    }

}