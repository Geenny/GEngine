import EventDispatcher from "./../event/EventDispatcher";
import TickerMachineVO from "./vo/TickerMachineVO";
import Ticker from "./Ticker";

export default class TickerMachine extends EventDispatcher {

    /**
     * 
     * @param {TickerMachineVO} vo 
     */
    constructor( vo ) {
        super();
        this.init( vo );
    }

    /**
     * 
     * @param { StateMachineVO } vo 
     */
    init( vo ) {
        this.initVars();
        this.initVO( vo );
        this._initDefaultTicker();
    }

    /**
     * 
     * @param { StateMachineVO } vo 
     */
    initVO( vo ) {
        this.vo = vo;
        this._startDefaultTicker();
    }

    initVars() {
        this._stateList = {};
        this._tickers = [];
    }

    _initDefaultTicker() {
        if (!this.startOnCreate) return;
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
        this._createTicker( this.fps );
    }
    _createTicker( fps, method  = null ) {
        const ticker = new Ticker( fps, method, true );
        this._tickers.push( ticker );
    }

}