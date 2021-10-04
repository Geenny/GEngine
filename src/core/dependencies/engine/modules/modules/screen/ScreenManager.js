import ScreenManagerVO from "./vo/ScreenBuilderVO";
import ScreenVO from "./vo/ScreenVO";
import ScreenEvent from "./event/ScreenEvent";
import Module from "../../Module";
import StructUtils from "../../../../../../data/content/struct/StructUtils";
import ScreenBuilder from "./ScreenBuilder";
import ScreenBuilderVO from "./vo/ScreenBuilderVO";
import TimeSystem from "../../../../systems/time/TimeSystem";
import ArrayUtils from "../../../../../../utils/tech/ArrayUtils";

export default class ScreenManager extends Module {

    /**
     * @param { ScreenManagerVO } screenManagerVO
     */
    constructor( screenManagerVO = new ScreenManagerVO() ) {
        super( screenManagerVO );
    }


    //
    // GET/SET
    //

    get inited() { return this._inited; }
    get debug() { return false; }

    get screen() { return this._screen; }
    get screenList()  { return this.vo.screenList; }
    get screenStructList()  { return this.vo.screenStructList; }
    get screenHistory() { return this.vo.screenHistory; }

    get screenBuilder() { return this._screenBuilder; }
    get screenBuilderStruct() { return this.vo.screenBuilderStruct; }


    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;
        this._initScreenManagerVars();
        this._initScreenBuilder();
        this._initScreens();
        this.showDefaultScreen();
    }

    _initScreenManagerVars() {
        this._screenListForShow = []; // Список скринов которые включаются
        this._screenOnlineList = []; // Список отображаемых скринов
        this._screenOfflineList = []; // Список скрываемых скринов
    }

    _initScreenBuilder() {
        this.screenBuilderStruct.options.application = this.application;
        const screenBuilder = StructUtils.createStruct( this.screenBuilderStruct, ScreenBuilder, ScreenBuilderVO );
        screenBuilder.init();
        this._screenBuilder = screenBuilder;
    }

    _initScreens() {
        if ( !Array.isArray( this.vo.screenStructList ) ) return;
        for ( let i = 0; i < this.vo.screenStructList.length; i++ ) {
            const screenStruct = this.vo.screenStructList[ i ];
            this.screenCreateByStruct( screenStruct );
        }
    }

    showDefaultScreen() {
        if ( !this.vo.showDefaultScreen ) return;
        if ( this.screen ) return;
        const screen = this._screenDefaultGet();
        if ( !screen ) return;
        this.screenShow( screen );
    }
    _screenDefaultGet() {
        for ( let i = 0; i < this.screenList.length; i++ ) {
            const screen = this.screenList[ i ];
            if ( !screen.isDefault ) continue;
            return screen;
        }
        return null;
    }


    //
    // DESTROY
    // 
    destroy() {
        while( this.screenList.length ) {
            const screen = this.screenList.shift();
            screen.removeEventListener( ScreenEvent.ANY, this.onScreen );
            screen.destroy();
        }
    }


    //
    // RESIZE
    //

    resize( size ) {
        super.resize( size );
        this.resizeScreens();
    }
    resizeScreens() {
        for ( let i = 0; i < this.screenList.length; i++ ) {
            const screen = this.screenList[ i ];
            if ( !screen.active ) continue;
            screen.resize( this.size );
        }
    }


    //
    // SCREEN
    //

    /**
     * @param { Object } screenStruct Исходные данные для @ScreenVO
     */
    screenCreateByStruct( screenStruct ) {
        const screen = this.screenCreate( screenStruct );
        this.screenList.push( screen );
        this.dispatchEvent( new ScreenEvent( ScreenEvent.CREATE, screen ) );
        return screen;
    }

    /**
     * Сщздать @Screen из его @ScreenVO
     * @param { ScreenVO } screenVO 
     */
    screenCreate( screenStruct ) {
        screenStruct.options.screenManager = this;
        const screen = StructUtils.createStruct( screenStruct, Screen, ScreenVO );
        screen.addEventListener( ScreenEvent.ANY, this.onScreen, this );
        screen.init();
        return screen;
    }

    isBusyScreenLayer( layer ) {
        const screen = this.screenActiveInLayerGet( layer );
        return !!screen;
    }

    screenInList( screen ) {
        return this.screenList.indexOf( screen ) >= 0;
    }

    /**
     * Вернуть @Screen по его @ScreenVO
     * @param { ScreenVO } screenVO 
     */
    screenGet( screenID ) {
        const screenStruct = this.screenStructGetByID( screenID );
        return screenStruct ? screenStruct.instance : null;
    }

    /**
     * Вернуть @ScreenSctruct по @ScreenVO
     * @param { ScreenVO } screenVO 
     */
    screenStructGetByID( screenID ) {
        for ( let i = 0; i < this.screenStructList.length; i++ ) {
            const screenStruct = this.screenStructList[ i ];
            if ( screenStruct.ID === screenID || screenStruct.name === screenID ) {
                return screenStruct;
            }
        }
        return null;
    }

    /**
     * Вернуть @ScreenSctruct по имени или ID @Screen
     * @param { Number } screenID ID или name
     */
    screenByIDGet( screenID ) {
        for ( let i = 0; i < this.screenList.length; i++ ) {
            const screen = this.screenList[ i ];
            if ( screen.ID === screenID || screen.name === screenID ) {
                return screen;
            }
        }
        return null;
    }

    /**
     * Отобразить контент данного @Screen по его @ID
     * @param { Number | String } ID | name
     * @return { Screen }
     */
    screenShowByID( screenID ) {
        const screen = this.screenByIDGet( screenID );
        this.screenShow( screen );
        return screen;
    }

    /**
     * Отобразить контент данного @Screen
     * @param { Screen } screen
     */
    screenShow( screen ) {
        if ( !this._screenAddToShowList( screen ) ) return;
        const screenInLayer = this.screenActiveInLayerGet( screen.layer );
        if ( screenInLayer ) {
            this.screenHide( screenInLayer );
        } else {
            this._screenShowStart();
        }
    }

    /**
     * Скрыть контент текущего @Screen
     */
    screenHide( screen = null ) {
        const screenForHide = screen || this.screen;
        if ( !screenForHide ) return;
        this._screenOnlineRemove( screen );
        if ( !this._screenOfflineAdd( screenForHide ) ) return;
        screenForHide.hide();
    }

    screenActiveInLayerGet( layer ) {
        for ( let i = 0; i < this._screenOnlineList.length; i++ ) {
            const screen = this._screenOnlineList[ i ];
            if ( screen.screenPopup ) continue;
            if ( screen.layer != layer ) continue;
            return screen;
        }
        return null;
    }

    _screenShowNext() {
        if ( this._screenListForShow.length === 0 ) return;
        this._screenShowStart();
    }
    _screenShowStart() {
        const screen = this._screenListForShow.shift();
        this._screenOnlineAdd( screen );
        screen.resize( this.size );
        screen.show();
        this._screenResort();
    }
    _screenShowComplete( screen ) {
        this.dispatchEvent( new ScreenEvent( ScreenEvent.SHOW, screen ) );
        this._screenShowNext();
    }

    _screenOnlineAdd( screen ) {
        this._screenOnlineList.push( screen );
    }
    _screenOfflineAdd( screen ) {
        if ( this._screenOfflineList.indexOf( screen ) < 0 ) {
            this._screenOfflineList.push( screen );
            return true;
        }
        return false;
    }
    _screenOnlineRemove( screen ) {
        const index = this._screenOnlineList.indexOf( screen );
        if ( index < 0 ) return;
        this._screenOnlineList.splice( index, 1 );
    }
    _screenOfflineRemove( screen ) {
        const index = this._screenOfflineList.indexOf( screen ) < 0;
        if ( index < 0 ) return;
        this._screenOfflineList.splice( index, 1 );
    }

    _screenResort() { }

    _screenHideComplete( screen ) {
        this.dispatchEvent( new ScreenEvent( ScreenEvent.HIDE, screen ) );
        this._screenOfflineRemove( screen );
        this._screenAddToHistory( screen );
        this.dispatchEvent( new ScreenEvent( ScreenEvent.REMOVE, this.screen ) );
        this._screenShowNext();
    }

    onScreen( event ) {
        switch( event.type ) {
            case ScreenEvent.SHOW_START: break;
            case ScreenEvent.SHOW:
                this._screenShowComplete( event.target );
                break;
            case ScreenEvent.HIDE_START: break;
            case ScreenEvent.HIDE:
                this._screenHideComplete( event.target );
                break;
        }
    }

    /**
     * Добавить @screen по его @screenID в список скринов которые должны быть запущены.
     * @param { Number | String } screenID 
     */
    _screenAddToShowList( screen ) {
        const idInList = this.screenInList( screen );
        if ( !idInList ) {
            throw new Error( "No screen in list!" );

        }
        const inOnlineList = ArrayUtils.isValueInList( this._screenOnlineList, "ID", screen );
        const canBeAdd = idInList && !inOnlineList && this._screenListForShow.indexOf( screen ) < 0;
        if ( canBeAdd ) this._screenListForShow.push( screen );
        return canBeAdd;
    }

    _screenAddToHistory( screenStruct ) {
        // const screenHistoryStruct = { ... ScreenHistoryStruct };
        // screenHistoryStruct.time = TimeSystem.now;
        // screenHistoryStruct.screenStruct = screenStruct;
        // this._screenHistory.push( screenHistoryStruct );
    }

}
