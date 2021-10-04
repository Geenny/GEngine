import TickerMachineVO from "./vo/TickerMachineVO";
import Ticker from "./Ticker";
import EventDispatcherVOWrapper from "../../../data/vo/EventDispatcherVOWrapper";

export default class TickerMachine extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { TickerMachineVO } vo 
     */
    constructor( vo ) {
        super( vo );
        this.init();
    }

    //
    // INIT
    //
    init( vo ) {
        this.initVars();
        this._initDefaultTicker();
    }

    //
    // DESTROY
    //
    destroy() {
        while( this._tickers.length ) {
            const ticker = this._tickers.shift();
            ticker.stop();
        }
    }

    initVars() {
        this._tickers = [];
    }

    _initDefaultTicker() {
        if ( !this.startOnCreate ) return;
        this._startDefaultTicker();
    }

    //
    // GET/SET
    //

    /**
     * Флаг автозапуска базового тикера
     */
    get startOnCreate() { return this.vo.startOnCreate; }

    /**
     * @Ticker по умолчанию
     */
    get defaultTicker() { return this._tickers[ 0 ]; }

    /**
     * Добавить метод (функцию) в стандарный @Ticker
     * @param { Function } method 
     */
    addMethod( method ) {
        if ( !this.defaultTicker ) return;
        this.defaultTicker.add( method );
    }

    _startDefaultTicker() {
        if ( this.defaultTicker ) return;
        this._createTicker( this.vo.fps );
    }
    _createTicker( fps = 60, method  = null ) {
        const ticker = new Ticker( fps, method, true );
        this._tickers.push( ticker );
    }

}