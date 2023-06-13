import EventDispathcer from "../../../machines/event/EventDispatcher";
import PlatformEvent from "../event/PlatformEvent";

export default class PlatformAbstract extends EventDispathcer {

    constructor( platform, parameters = null ) {
        super();
        this.platform = platform;
        this.parameters = parameters || {};
    }


    //
    // GET/SET
    //

    get started() { return this._started; }
    get starting() { return this._starting; }


    //
    // INIT
    //

    init() {
        this.initVars();
        this.initCallbacks();
        this.initMethodContext();
    }
    initVars() {
        this._started = false;
        this._starting = false;
        this.progress = 0;
    }
    initCallbacks() {
        if ( this.parameters.onInit ) this.onInit = this.parameters.onInit.bind( this );
        if ( this.parameters.onStart ) this.onStart = this.parameters.onStart.bind( this );
        if ( this.parameters.onReady ) this.onReady = this.parameters.onReady.bind( this );
        if ( this.parameters.onFriends ) this.onFriends = this.parameters.onFriends.bind( this );
    }
    initMethodContext() {
        this.apiOnInit = this.apiOnInit.bind( this );
        this.apiOnStart = this.apiOnStart.bind( this );
        this.apiOnReady = this.apiOnReady.bind( this );
        this.apiOnFriends = this.apiOnFriends.bind( this );
        this.apiOnError = this.apiOnError.bind( this );
        this.apiOnDataGet = this.apiOnDataGet.bind( this );
        this.apiOnDataSet = this.apiOnDataSet.bind( this );
    }


    //
    // PLATFORM
    //
    start() { }
    stop() { }

    /**
     * Init
     */
    apiInit() { }
    apiOnInit() {
        this.apiInitUpdate();
        this.dispatchEvent( new PlatformEvent( PlatformEvent.INIT, this.platform ) );
        if ( this.onInit ) this.onInit();
    }
    apiInitUpdate() { }

    /**
     * Start
     */
    apiStart() { }
    apiOnStart() {
        this.apiStartUpdate();
        this.dispatchEvent( new PlatformEvent( PlatformEvent.START, this.platform ) );
        if ( this.onStart ) this.onStart();
    }
    apiStartUpdate() { }

    /**
     * READY
     */
    apiReady() {
        this.apiOnReady();
    }
    apiOnReady() {
        this.apiReadyUpdate();
        this.dispatchEvent( new PlatformEvent( PlatformEvent.READY, this.platform ) );
        if ( this.onReady ) this.onReady();
    }
    apiReadyUpdate() { }
    
    /**
     * Friends
     */
    apiFriendsGet() {}
    apiOnFriends( friends = [] ) {
        this.platform.vo.playerFriends = friends;
        const friendsData = { friends };
        this.dispatchEvent( new PlatformEvent( PlatformEvent.FRIENDS, this.platform, friendsData ) );
        if ( this.onFriends ) this.onFriends();
    }

    /**
     * Error
     */
    apiOnError( error ) {
        this.dispatchEvent( new PlatformEvent( PlatformEvent.ERROR, this.platform, { error } ) );
    }

    apiCheckReady() {
        if ( !this.starting || this.started ) return;
        this._starting = false;
        this._started = true;
        this.apiReady();
    }

    progressSet( progress = 0 ) {
        if ( !this.starting ) return;
        this.progress = Math.min( 1, Math.max( 0, progress ) );
    }

    /**
     * Обновить счет на API
     * @param { Number } score 
     */
    scoreSet( score = 0 ) { }

    //
    // DATA
    //
    get data() { return this._data || { }; }
    set data( value ) { this._data = value; }

    /**
     * Сохранить или прочесть данные из API
     * @param { Object } object 
     */
    dataGet() {
        this.apiOnDataGet( this.data );
    }
    dataSet( data ) {
        this.data = data;
        this.apiOnDataSet();
    }
    apiOnDataGet( data = {} ) {
        this.dispatchEvent( new PlatformEvent( PlatformEvent.DATA_GET, this.platform, data ) );
    }
    apiOnDataSet() {
        this.dispatchEvent( new PlatformEvent( PlatformEvent.DATA_SET, this.platform, this.data ) );
    }

}