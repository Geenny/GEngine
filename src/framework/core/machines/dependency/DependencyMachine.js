import DependencyMachineVO from "./vo/DependencyMachineVO";
import DependencyEvent from "./events/DependencyEvent";
import DependencyMachineEvent from "./events/DependencyMachineEvent";
import Event from "../event/Event";
import DependencyStates from "./states/DependencyState";
import DependencyAbstract from "./DependencyAbstract";
import DependencyVO from "./vo/DependencyVO";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
import DependencyStruct from "./struct/DependencyStruct";
import EventDispatcherVOWrapper from "../../../data/vo/EventDispatcherVOWrapper";

export default class DependencyMachine extends EventDispatcherVOWrapper {

    constructor( dependencyMachineVO = new DependencyMachineVO() ) {
        super( dependencyMachineVO );
        this._initVars();
    }

    //
    // GET/SET
    //

    get application() { return this.vo.application; }
    get dependencyStructList() { return this.vo.dependencyStructList; }

    /**
     * Создание списка @dependency
     */
    get dependencyCreating() { return this._dependencyCreating; }

    //
    // INIT
    //

    init() {
        this.dependencyStructListCheck();
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

    /**
     * 
     * @param {DependencyStruct} dependencyStruct 
     */
    dependencyCreate( dependencyStruct ) {
        this.dependencyStructAutofix( dependencyStruct );
        const dependency = this._dependencyCreate( dependencyStruct );
        return dependency;
    }

    /**
     * Добавить экземпляр созданного @DependencyAbstract наследника
     * Запускает работу зависимости если это не цыклическое создание из конфигурации
     * @DependencyMachine
     * @param {DependencyAbstarct} dependency
     * @return {DependencyMachine}
     */
    dependencyAdd( dependency ) {

        if ( !this.dependencyInList( dependency ) ) {
            const dependencyStruct = this._createDependencyStructByInstance( dependency );
            if ( this.dependencyStructCheck( dependencyStruct ) ) {
                this._dependencyStructRegister( dependencyStruct );
            }
        }

        // this.dependencyStart( dependency );
        this.dependencyUpdateWorkDependence();

        return this;

    }

    /**
     * Проверка наличия данной зависимости в списке зависимостей данной
     * машины зависимостей
     * @param { DependencyAbstarct } dependency 
     */
    dependencyInList( dependency ) {
        for ( const key in this.dependencyList ) {
            const dependencyStruct = this.dependencyList[ key ];
            if ( dependencyStruct.dependency === dependency )
                return true;
        }
        return false;
    }

    /**
     * Проверить на наличие всех необходимых входящий параметров для управдения @DependencyAbstract
     * @param {DependencyStruct} dependencyStruct 
     */
    dependencyStructCheck( dependencyStruct ) {
        return dependencyStruct.ID > 0 &&
            dependencyStruct.name;
    }

    dependencyStructInList( dependencyStruct ) {
        for (const key in this.dependencyList) {
            if ( this.dependencyList[ key ] === dependencyStruct )
                return true;
        }
        return false;
    }

    /**
     * Автозаполнение полей которые могут быть значениями исходя из присутствующих данных
     * @param {*} dependencyStruct 
     */
    dependencyStructAutofix( dependencyStruct ) {
        if ( dependencyStruct ) {
            if ( !dependencyStruct.name )
                dependencyStruct.name = dependencyStruct.class.name;
        }
    }

    /**
     * Проверить список данных для @Dependency
     */
    dependencyStructListCheck() {
        const registredDependencyIDs = [];
        for ( let i = this.dependencyStructList.length - 1; i > -1; i-- ) {
            const dependencyStructData = this.dependencyStructList[ i ];
            if ( registredDependencyIDs.indexOf( dependencyStructData.ID ) >= 0 ) {
                this.dependencyStructList.splice( i, 1 );
            } else {
                registredDependencyIDs.push( dependencyStructData.ID );
            }
        }
    }

    /**
     * 
     * @param {DependencyAbstract} dependency 
     */
    _dependencyStructByInstanceGet( dependency ) {

        for ( const key in this.dependencyStructList ) {

            const dependencyStruct = this.dependencyStructList[ key ];
            if ( dependencyStruct.dependency === dependency ) {
                return dependencyStruct;
            }

        }

        return null;

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
     * Вернуть @DependencyAbstract по имени @dependency
     * @param { Number } ID Параметр из @DependencyIDs
     */
    dependencyByIDGet( ID ) {
        for ( const key in this.dependencyList ) {
            const dependencyStruct = this.dependencyList[ key ];
            const dependency = dependencyStruct.dependency;
            if ( dependency && dependency.ID === ID )
                return dependency;
        }
        return null;
    }

    /**
     * Вернуть @DependencyAbstract по имени @dependency
     * @param { String } name 
     */
    dependencyByNameGet( name ) {
        for ( const key in this.dependencyList ) {
            const dependencyStruct = this.dependencyList[ key ];
            const dependency = dependencyStruct.dependency;
            if ( dependency && dependency.name === name )
                return dependency;
        }
        return null;
    }

    /**
     * Проверить или все зависимости гововы и работают для данной зависимости
     * @param { DependencyAbstract } dependency 
     */
    dependencyLinksOK( dependency ) {
        if ( dependency ) {

            const list = [];
            const dependenceStruct = this._dependencyStructByInstanceGet( dependency );
            const dependenceNameList = dependenceStruct.dependenceNameList;

            for ( const key in this.dependencyList ) {

                const dependencyStruct = this.dependencyList[ key ];
                const dependencyInstance = dependencyStruct.dependency;
                const containsDependencyIsReady = dependenceNameList.indexOf( dependencyStruct.name ) != -1 ||
                    dependenceNameList.indexOf( dependencyStruct.ID );

                if ( containsDependencyIsReady && dependencyInstance.state === DependencyStates.WORKING ) {
                    list.push( dependencyStruct.name );
                }

                if ( list.length >= dependenceNameList.length )
                    return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param {DependencyAbstruct} dependency 
     */
    isDependencyWorking( dependency ) {
        if ( !dependency ) return;
        const list = [ DependencyStates.WORKING, DependencyStates.STARTING, DependencyStates.STARTED ];
        return ArrayUtils.inArray( dependency.state, list );
    }

    /**
     * Создать @dependecy по данным из @DependencyStruct
     * @param {DependencyStruct} dependencyStruct 
     * @return {DependencyAbstract}
     */
    _dependencyCreate( dependencyStruct ) {
        
        if ( !this.dependencyStructCheck( dependencyStruct ) ) return null;

        const DependencyClass = dependencyStruct.class || DependencyAbstract;
        const DependencyVOClass = dependencyStruct.classVO || DependencyVO;
        const dependencyVO = new DependencyVOClass( dependencyStruct.options );
        dependencyVO.ID = dependencyStruct.ID;
        dependencyVO.name = dependencyStruct.name;
        dependencyVO.application = this.application;

        const dependency = new DependencyClass( dependencyVO );
        dependency.init();

        dependency.addEventListener( Event.ANY, this._onDependencyEvent, this );

        dependencyStruct.dependency = dependency;
        dependencyStruct.dependencyVO = dependencyVO;

        return dependency;
    }

    /**
     * Просто воссоздание @DependencyStruct по экземпляру @DependencyAbstract
     * @param {DependencyAbstract} dependency 
     * @return {DependencyStruct}
     */
    _createDependencyStructByInstance( dependency ) {
        if ( !dependency ) return null;

        const dependencyVO = dependency.vo;
        dependencyVO.application = this.application;

        const dependencyStruct = {
            ... DependencyStruct,
            ID: dependency.ID,
            name: dependency.name,
            class: dependency.constructor,
            dependency,
            dependecyVO,
            options: dependency.vo.source
        }
        return dependencyStruct;
    }

    /**
     * Добавить @DependencyStruct в список dependencyList. 
     * Эквивалент добавления самого @DependencyAbstract в список @DependencyMachine
     * @param {*} dependencyStruct 
     */
    _dependencyStructRegister( dependencyStruct ) {
        if ( !this.dependencyStructInList( dependencyStruct ) ) {
            this.dependencyList.push( dependencyStruct );
            this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_ADD, this, dependencyStruct.dependency ) );
            return true;
        }
        return false;
    }

    /**
     * Создание всем @Dependency из списка @dependencyStructList
     * Те экземпляры по которым @Dependency уже созданы будут проигнорированы
     */
    _dependencyCreateAll() {
        this._dependencyCreating = true;
        for ( const key in this.dependencyStructList ) {
            const dependencyStruct = this.dependencyStructList[ key ];
            const dependency = this.dependencyCreate( dependencyStruct );
            this._dependencyStructRegister( dependencyStruct );
        }
        this._dependencyCreating = false;
    }
    _dependencyStartAll() {
        for ( let i = 0; i < this.dependencyList.length; i++ ) {
            const dependencyStruct = this.dependencyList[ i ];
            this.dependencyStart( dependencyStruct.dependency );
        }
    }

    _dependencyStart( dependency ) {
        dependency.start();
    }
    
    _dependencyStop( dependency ) {
        dependency.stop();
        this._dispatch( new DependencyMachineEvent( DependencyMachineEvent.DEPENDENCY_STOPPING, this, dependency ) );
    }

    _dependencyCanStart( dependency ) {
        return !this.dependencyCreating &&
            dependency &&
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

}