import EventDispatcherVOWrapper from "../../../../../data/vo/EventDispatcherVOWrapper";
import ScreenManagerVO from "./vo/ScreenBuilderVO";
import ScreenVO from "./vo/ScreenVO";
import ScreenStruct from "./sctruct/ScreenSctruct";
import ScreenEvent from "./event/ScreenEvent";
import ScreenHistoryStruct from "./sctruct/ScreenHistoryStruct";
import TimeSystem from "../../../systems/time/TimeSystem";

export default class ScreenManager extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { ScreenManagerVO } screenManagerVO
     */
    constructor( screenManagerVO = new ScreenManagerVO() ) {
        super( screenManagerVO );
    }


    //
    // GET/SET
    //

    get inited() { return this._inited; }
    get screen() { return this.screenScruct ? this.screenScruct.instance : null; }
    get screenScruct() { return this._screenScruct; }
    get screenHistory() { return this._screenHistory; }
    get screenStructList()  { return this._screenStructList; }


    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;
        this.initVars();
        this.initScreen();
    }

    initVars() {
        this._screenStructList = [];
        this._screenHistory = [];
    }

    initScreen() {
        if ( !Array.isArray( this.vo.screenList ) ) return;
        for ( let i = 0; i < this.vo.screenList.length; i++ ) {
            const screenVOData = this.vo.screenList[ i ];
            this.screenCreateByData( screenVOData );
        }
    }


    //
    // SCREEN
    //

    /**
     * 
     * @param { Object } screenVOData Исходные данные для @ScreenVO
     */
    screenCreateByData( screenVOData ) {
        const ScreenVOClass = screenVOData.classVO || ScreenVO;
        const screenVO = new ScreenVOClass( screenVOData );
        const screenScruct = this.screenCreate( screenVO );
        this.dispatchEvent( new ScreenEvent( ScreenEvent.CREATE, screenScruct ) );
        return screenScruct;
    }

    /**
     * Сщздать @Screen из его @ScreenVO
     * @param { ScreenVO } screenVO 
     */
    screenCreate( screenVO ) {
        const ScreenClass = screenVO.class || Screen;
        const screen = new ScreenClass( screenVO );
        screen.init();

        // Создать @ScreenStruct
        const screenStruct = {
            ... ScreenStruct,
            ID: screen.ID,
            name: screen.name,
            class: ScreenClass,
            classVO: screenVO.classVO || null,
            instance: screen,
            instanceVO: screenVO,
        };
        this._screenStructList.push( screenStruct );

        return screenStruct;
    }

    /**
     * Вернуть @Screen по его @ScreenVO
     * @param { ScreenVO } screenVO 
     */
    screenGet( screenVO ) {
        const screenStruct = this.screenStructGet( screenVO );
        return screenStruct ? screenStruct.instance : null;
    }

    /**
     * Вернуть @ScreenSctruct по @ScreenVO
     * @param { ScreenVO } screenVO 
     */
    screenStructGet( screenVO ) {
        for ( let i = 0; i < this._screenStructList.length; i++ ) {
            const screenStruct = this._screenStructList[ i ];
            if ( screenStruct.instanceVO === screenVO ) {
                return screenStruct;
            }
        }
        return null;
    }

    /**
     * Вернуть @ScreenSctruct по имени или ID @Screen
     * @param { ScreenVO } screenVO 
     */
    screenStructGetByID( screenID ) {
        for ( let i = 0; i < this._screenStructList.length; i++ ) {
            const screenStruct = this._screenStructList[ i ];
            if ( screenStruct.ID === screenID || screenStruct.name === screenID ) {
                return screenStruct;
            }
        }
        return null;
    }

    /**
     * Скрыть контент текущего @Screen
     */
    screenHide() {
        if ( !this.screenScruct ) return;
        this.screen.hide();
        this._screenAddToHistory( this.screenScruct );
        this._screenScruct = null;
        this.dispatchEvent( new ScreenEvent( ScreenEvent.REMOVE, this.screenScruct ) );
    }

    /**
     * Отобразить контент данного @Screen
     * @param { Number | String } ID | name
     */
    screenShow( screenID ) {
        this.screenClear();
        this._screenStruct = this.screenStructGetByID( screenID );
        this.screen.show();
        this.dispatchEvent( new ScreenEvent( ScreenEvent.ADD, this.screenScruct ) );
    }

    _screenAddToHistory( screenStruct ) {
        const screenHistoryStruct = { ... ScreenHistoryStruct };
        screenHistoryStruct.time = TimeSystem.now;
        screenHistoryStruct.screenStruct = screenStruct;
        this._screenHistory.push( screenHistoryStruct );
    }

}
