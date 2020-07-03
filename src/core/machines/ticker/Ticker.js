import EventDispatcher from "./../event/EventDispatcher";
import TickerMachineVO from "./vo/TickerMachineVO";
import MethodUtils from "../../../utils/tech/MethodUtils";
import ArrayUtils from "../../../utils/tech/ArrayUtils";

export default class Ticker {

    /**
     * 
     * @param { Number } fps Фрэймрейт
     * @param { Array } methods Список методов для вызова тикером
     * @param { Boolean } autostart Флаг автозапуска 
     */
    constructor( fps = 60, methods = null, autostart = false ) {
        this._list = [];
        this.fps = fps;
        this.add( methods );
        if ( autostart ) this.start();
    }

    //
    // GET/SET
    //

    get fps() { return this._fps; }
    set fps( value ) {
        this._fps = (value <= 0 || value > 1000) ? 60 : value;
        this._frametime = Math.floor( 1000 / this._fps );
        this.restart();
    }

    get frametime() { return this._frametime; }
    get started() { return this._interval; }
    get interval() { return this._interval; }

    /**
     * Запускает @Ticker
     */
    start() {
        if ( this.started ) return;
        this._createTickerInterval();
    }

    /**
     * Останавливает @Ticker
     */
    stop() {
        if ( !this.interval ) return;
        clearInterval( this.interval );
        this._interval = null;
    }

    /**
     * Перезапускает @Ticker если он был запущен до этого и ( @this.started === true )
     */
    restart() {
        if ( !this.started ) return;
        this.stop();
        this.start();
    }

    /**
     * 
     * @param { Function | Function[] } method 
     */
    add( methods ) {
        if ( Array.isArray( methods ) ) {
            for ( let i = 0; i < methods.length; i++ ) {
                this.addMethod( methods[ i ] );
            }
        } else {
            this.addMethod( methods )
        }
    }

    /**
     * Добавить метод (функцию) в 
     * @param { Function } method 
     */
    addMethod( method ) {
        if ( !MethodUtils.isMethod( method ) ) return;
        if ( ArrayUtils.inArray( method, this._list ) ) return;
        this._list.push( method );
    }

    destroy() {
        this.stop();
        this._list.length = 0;
        this._list = null;
    }

    _createTickerInterval() {
        this._interval = setInterval( () => {
            for ( let i = 0; i < this._list.length; i++ ) {
                this._list[i]();
            }
        }, this.frametime );
    }

}