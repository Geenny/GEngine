import DisplayEvent from "../event/DisplayEvent";
import DisplayVO from "../vo/DisplayVO";
import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";

export default class AbstractDisplay extends EventDispatcherVOWrapper {

    /**
     * Абстрактный класс обертка для рендеров.
     * Для построения после создание необходимо вызывать init()
     * @param { DisplayVO } DisplayVO 
     */
    constructor( displayVO = new DisplayVO() ) {

        super( displayVO );

    }


    //
    // GET/SET
    //

    /**
     * Доступность
     */
    get enable() { return this._enable; }
    set enable( value ) { this._enable = value; }

    /**
     * Тип дисплея
     */
    get type() { return this.vo.type; }

    /**
     * Отношение сторон
     */
    get aspect() { return this.size.x / this.size.y; }

    /**
     * Размер рендерера
     */
    get size() { return this.vo.size; }
    set size( value ) { this.vo.size.setFromPoint( value ); }

    /**
     * VIEW Element
     */
    get viewElement() { return this.vo.viewElement; }
    set viewElement( value ) {
        this.vo.viewElement = value;
        this.dispatchEvent( new DisplayEvent( DisplayEvent.VEIW_ELEMENT_READY ) );
    }

    /**
     * CANVAS of VIEW Element
     */
    get canvas() { return this.vo.canvas; }


    
    //
    // INIT
    //

    init() {
        this.initVars();
        this.initEngine();
    }
    initVars() { }
    initEngine() { }


    //
    // RESIZE
    //

    /**
     * @param { Point } size 
     */
    resize( width, height ) {
        this.size.update( width, height );
    }


    //
    // RENDER UPDATE
    //

    /**
     * Вызов метода отрисовки
     */
    draw() { }

}