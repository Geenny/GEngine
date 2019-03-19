import EventDispathcer from "../event/EventDispatcher";
import DependencyMachineVO from "./vo/DependencyMachineVO";
import DependencyEvent from "./events/DependencyEvent";
import DependencyMachineEvent from "./events/DependencyMachineEvent";
import Event from "../event/Event";
import DependencyStates from "./states/DependencyState";
import DependencyAbstract from "./DependencyAbstract";
import DependencyVO from "./vo/DependencyVO";
import ArrayUtils from "../../../utils/tech/ArrayUtils";

export default class DependencyMachine extends EventDispathcer {

    constructor( vo = new DependencyMachineVO() ) {
        super();
        this._setVO( vo );
        this._initVars();
    }

    //
    // GET/SET
    //

    get dependencyStructList() { return this.vo.dependencyStructList; }

    //
    // INIT
    //

    init() {
        this.dependencyStartAll();
    }
    _initVars() {
        this.dependencyList = [];
    }


    //
    // DEPENDENCY
    //

    dependencyStartAll() {
        this._dependencyCreateAll();
        this._dependencyStartAll();

        // let starting = true;
        // for ( const key in this.dependencyStructList ) {
        //     const dependencyStruct = this.dependencyStructList[ key ];
        //     if ( this.dependencyStartByStruct( dependencyStruct ) )
        //         starting = false;
        // }
        // if ( !starting ) {
        //     this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_STARTED_ALL ) );
        // }
    }

    dependencyStopAll() {
        for ( const key in this.dependencyStructList ) {
            const dependencyStruct = this.dependencyStructList[ key ];
            this.dependencyStop( dependencyStruct.dependency );
        }
    }

    dependencyStart( dependency ) {
        if ( this._dependencyCanStart( dependency ) ) {
            this._dependencyStart( dependency );
            return true;
        }
        return false;
    }

    dependencyStop( dependency ) {
        if ( this.dependencyInList( dependency ) &&
             dependency.isWorking )
        {
            this._dependencyStop( dependency );
            this.dependencyUpdateWorkDependence();
        }
    }

    dependencyStartByStruct( dependencyStruct ) {
        const dependency = this.dependencyCreate( dependencyStruct );
        if ( dependency) {
            this.dependencyAdd( dependencyStruct );
            return this.dependencyStart( dependency );
        }
        return false;
    }

    /**
     * 
     * @param {DependencyStruct} dependencyStruct 
     */
    dependencyStructCheck( dependencyStruct ) {
        const a = dependencyStruct.ID > 0;
        const b = dependencyStruct.name;
        // const c = dependencyStruct.class.prototype instanceof DependencyAbstract;
        return a && b;
    }

    /**
     * 
     * @param {DependencyStruct} dependencyStruct 
     */
    dependencyCreate( dependencyStruct ) {
        const dependency = this._dependencyCreate( dependencyStruct );
        return dependency;
    }

    /**
     * 
     * @param {DependencyAbstarct} dependency 
     */
    dependencyAdd( dependency ) {
        if ( !this.dependencyInList( dependency ) ) {
            this.dependencyList.push( dependency );
        }
        return this;
    }

    /**
     * Проверка наличия данной зависимости в списке зависимостей данной
     * машины зависимостей
     * @param { DependencyAbstarct } dependency 
     */
    dependencyInList( dependency ) {
        for (const key in this.dependencyList) {
            const dependencyStruct = this.dependencyList[ key ];
            if ( dependencyStruct.dependency === dependency )
                return true;
        }
        return false;
    }

    dependencyUpdateWorkDependence() {

        for ( const key in this.dependencyStructList ) {

            const dependencyStruct = this.dependencyStructList[ key ];
            const dependency =  dependencyStruct.dependency;
            const linksIsOK = this.dependencyLinksOK( dependency );
            const isWorking = this.isDependencyWorking( dependency );

            if ( isWorking && !linksIsOK ) {
                this.dependencyStop( dependency );
            } else if ( !isWorking && linksIsOK ) {
                this.dependencyStart( dependency );
            }

        }

    }

    /**
     * Проверить или все зависимости гововы и работают для данной зависимости
     * @param { DependencyAbstract } dependency 
     */
    dependencyLinksOK( dependency ) {
        if ( dependency ) {

            const list = [];
            const dependenceNameList = dependency.dependenceNameList;

            for ( const key in this.dependencyList ) {

                const dependencyStruct = this.dependencyList[ key ];
                const dependencyInstance = dependencyStruct.dependency;

                if ( dependenceNameList.indexOf( dependencyStruct.name ) != -1 &&
                    dependencyInstance.state === DependencyStates.WORKING )
                {
                    list.push( dependencyStruct.name );
                }

                if ( list.length >= dependenceNameList.length )
                    return true;
            }
        }

        return false;
    }

    isDependencyWorking( dependency ) {
        if ( !dependency ) return;
        const list = [ DependencyStates.WORKING, DependencyStates.STARTING, DependencyStates.STARTED ];
        return ArrayUtils.inArray( dependency.state, list );
    }

    _dependencyCreate( dependencyStruct ) {
        if ( !this.dependencyStructCheck( dependencyStruct ) ) return null;

        const DependecyClass = dependencyStruct.class;
        const dependencyVO = new DependencyVO( dependencyStruct.options );
        dependencyVO.ID = dependencyStruct.ID;
        dependencyVO.name = dependencyStruct.name;

        const dependency = new DependecyClass( dependencyVO );
        dependency.init();

        dependency.addEventListener( Event.ANY, this._onDependencyEvent, this );

        dependencyStruct.dependency = dependency;
        dependencyStruct.dependencyVO = dependencyVO;

        return dependency;
    }

    /**
     * Создание всем @Dependency из списка @dependencyStructList
     * Те экземпляры по которым @Dependency уже созданы будут проигнорированы
     */
    _dependencyCreateAll() {
        for ( const key in this.dependencyStructList ) {
            const dependencyStruct = this.dependencyStructList[ key ];
            const dependency = this.dependencyCreate( dependencyStruct );
            if ( dependency) 
                this.dependencyAdd( dependencyStruct );
        }
    }
    _dependencyStartAll() {
        for ( let i = 0; i < this.dependencyList.length; i++ ) {
            const dependencyStruct = this.dependencyList[ i ];
            this.dependencyStart( dependencyStruct.dependency );
        }
    }

    _dependencyStart( dependency ) {
        dependency.start();
        this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_STARTING, dependency ) );
    }
    
    _dependencyStop( dependency ) {
        dependency.stop();
        this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_STOPPING, dependency ) );
    }

    _dependencyCanStart( dependency ) {
        return dependency &&
            dependency.state === DependencyStates.STOPPED &&
            this.dependencyLinksOK( dependency );
    }
    _dependencyCanStop( dependency ) {
        return this.isDependencyWorking( dependency ) &&
            this.dependencyLinksOK( dependency );
    }

    _dispatch( dependencyMachineEvent, dependency = null ) {
        this.dispatchEvent( dependencyMachineEvent, this, dependency );
    }

    _dependencyIsStarted( dependency ) { }
    _dependencyIsWorking( dependency ) {
        this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_STARTED, this, dependency ) );
        this.dependencyUpdateWorkDependence();
    }
    _dependencyIsStopped( dependency ) {
        this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_STOPPED, this, dependency ) );
        this.dependencyUpdateWorkDependence();
    }

    /**
     * Обработка события из @DependencyAbstract
     * @param { DependencyEvent } event 
     */
    _onDependencyEvent( event ) {
        switch( event.type ) {
            case DependencyEvent.STARTING: break;
            case DependencyEvent.STARTED:
                this._dependencyIsStarted( event.target );
                break;
                
            case DependencyEvent.WORKING:
                this._dependencyIsWorking( event.target );
                break;
            
            case DependencyEvent.STOPPED:
            case DependencyEvent.ERROR:
                this._dependencyIsStopped( event.target );
                break;
        }
    }

    _setVO( vo ) {
        this.vo = vo;
    }

}