import EventDispathcer from "../../../machines/event/EventDispatcher";

export default class AbstractDisplay extends EventDispathcer {

    /**
     * Абстрактный класс обертка для рендеров.
     * Для построения после создание необходимо вызывать init()
     * @param { DisplayStruct } displayStruct 
     */
    constructor( displayStruct = {} ) {

        super();

        this.displayStruct = displayStruct;
        this.vo = displayStruct.displayVO;

    }


    //
    // GET/SET
    //

    /**
     * 
     */
    get enable() { return this._enable; }
    set enable( value ) { this._enable = value; }

    /**
     * VIEW Element
     */
    get viewElement() { return this._viewElement; }
    set viewElement( value ) {
        this._viewElement = value;
    }

    /**
     * CANVAS of VIEW Element
     */
    get canvas() { return this._canvas; }

    
    //
    // INIT
    //

    init() {
        this.initVars();
        this.initEngine();
    }
    initVars() {
        this._viewElement = null;
        this._canvas = null;
    }
    initEngine() { }


    /**
     * @param { Point } size 
     */
    resize( size ) { }


    //
    // RENDER UPDATE
    //

    /**
     * Вызов метода отрисовки
     */
    draw() { }

}