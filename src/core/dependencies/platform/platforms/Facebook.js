import PlatformEvent from "../event/PlatformEvent";
import { IOS, ANDROID, WEB } from "../constants/PlatformType";
import Abstract from "./Abstract";

export default class Facebook extends Abstract {

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

        FBInstant.initializeAsync()
            .then( this.apiOnInit )
            .catch( this.apiOnError );
    }
    apiInitUpdate() {
        this.platform.vo.platformType = this.getPlatformType(); // 'IOS', 'ANDROID' or 'WEB'
        this.platform.vo.platformVersion = FBInstant.getSDKVersion();
        this.platform.vo.platformLocale = FBInstant.getLocale();
        this.platform.vo.playerID = FBInstant.player.getID();
    }
    getPlatformType() {
        const platformType = FBInstant.getPlatform();
        switch( platformType ) {
            case "IOS": return IOS;
            case "ANDROID": return ANDROID;
            default: return WEB;
        }
    }

    /**
     * Start
     */
    apiStart() {
        if ( !this.starting ) return;
        this.progressSet( 1 );
        FBInstant.startGameAsync()
            .then( this.apiOnStart )
            .catch( this.apiOnError );
    }
    apiOnStart() {
        super.apiOnStart();
        this.apiFriendsGet();
    }
    apiStartUpdate() {
        this.platform.vo.playerName = FBInstant.player.getName();
        this.platform.vo.playerAvatar = FBInstant.player.getPhoto();
    }
    
    apiOnError( error ) {
        this.dispatchEvent( new PlatformEvent( PlatformEvent.ERROR, this.platform, { error } ) );
    }

    apiFriendsGet() {
        FBInstant.player.getConnectedPlayersAsync()
            .then( this.apiOnFriends )
            .catch( this.apiOnError );
    }
    apiOnFriends( friends = [] ) {
        super.apiOnStart();
        this.apiCheckReady();
    }

    /**
     * Обновить прогресс загрузки
     * @param { Number } progress 0-1 
     */
    progressSet( progress = 0 ) {
        super.progressSet( progress );
        FBInstant.setLoadingProgress( this.progress * 100 );
    }

    scoreSet( score = 0 ) {
        if ( typeof score != "number" ) return;
        if ( score < 0 ) return;
        FBInstant.postSessionScore( score );
    }
    
    dataGet() {
        FBInstant.player.getDataAsync( [ "data" ] )
            .then( data => {
                this.apiOnDataGet( data ? data.data : {} );
            } )
            .catch( this.apiOnError );
    }
    dataSet( data ) {
        this.data = data;
        FBInstant.player.setDataAsync( { data } )
            .then( this.apiOnDataSet )
            .catch( this.apiOnError );
    }

}