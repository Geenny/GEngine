import SystemsVO from "./vo/SystemsVO";
import DependencyAbstract from "../../../machines/dependency/DependencyAbstract";
import SystemVO from "./vo/SystemVO";
import SystemManagerEvent from "./event/SystemManagerEvent";
import SystemEvent from "./event/SystemEvent";

export default class Systems extends DependencyAbstract {

    /**
     * 
     * @param {SystemsVO} systemsVO Наследник @DependencyVO
     */
    constructor( systemsVO = new SystemsVO() ) {
        super( systemsVO );
    }

    //
    // GET/SET
    //

    get systems() { 
        if ( !this._systems ) this._systems = [];
        return this._systems;
    }
    get systemsSourceList() {
        if ( !this._systemsSourceList ) this._systemsSourceList = [];
        return this._systemsSourceList;
    }
    get systemsStartList() { return this.vo.systemsStartList; }

    //
    // INIT
    //

    init() {
        super.init();
    }


    //
    // SYSTEMS
    //

    /**
     * 
     */
    startProcess() {
        for ( const key in this.systemsStartList ) {
            const systemData = this.systemsStartList[ key ];
            const system = this.systemAddFromVOData( systemData );
            this._systemStart( system );
        }
        this.startComplete();
    }

    stopProcess() {
        for ( const system in this.systems ) {
            this._systemStop( system );
        }
        this.stopComplete();
    }



    //
    // SYSTEM
    //

    /**
     * 
     * @param {System} systemSource 
     */
    systemAddFromVOData( systemData ) {

        const system = this._systemCreate( systemData );

        if ( system ) {
            this.systemsSourceList.push( {
                system,
                systemData
            } );
            return system;
        }

        return null;

    }

    /**
     * Содержится определенный @SystemAbstract в списке
     * @param {System} system 
     */
    systemInList( system ) {
        return system && this.systems.indexOf( system ) != -1;
    }

    /**
     * Вернуть экземпляр @System по имени
     * @param {string} name 
     */
    systemGetByName( name ) {
        for ( const key in this.systems ) {
            const system = this.systems[ key ];
            if ( system && system.name === name )
                return system;
        }
        return null;
    }

    _systemStart( system ) {

        if ( !system ) return;
        if ( system.isStarted ) return;
        if ( !this.systemInList( system ) )
            this._systemAdd( system );
        
        system.start();

        this.dispatchEvent( new SystemManagerEvent( SystemManagerEvent.SYSTEM_START, this, system ) );
    }

    _systemStop( system ) {

        if ( !system ) return;
        if ( !system.isStarted ) return;
        if ( !this.systemInList( system ) ) return;

        system.stop();

        this.dispatchEvent( new SystemManagerEvent( SystemManagerEvent.SYSTEM_STOP, this, system ) );
        
    }

    _systemAdd( system ) {

        system.addEventListener( Event.ANY, this._onSystemEvent, this );
        this.systems.push( system );

    }

    _systemCreate( systemSource ) {
        
        try {
            const SystemClass = systemSource.class;
            const systemVO = new SystemVO( systemSource.options );
            systemVO.target = this.application;
            systemVO.name = systemVO.name ? systemVO.name : SystemClass.name;

            const system = new SystemClass( systemVO );

            return system;
        } catch ( error ) {
            return null;
        }

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
        this.dispatchEvent( new SystemEvent( event.type, event.target ) );
    }

}