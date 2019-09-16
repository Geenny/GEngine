import EventDispathcer from "../../../machines/event/EventDispatcher";
import DisplayEvent from "../event/DisplayEvent";
import DisplayVO from "../vo/DisplayVO";

export default class AbstractDisplay extends EventDispathcer {

    /**
     * Абстрактный класс обертка для рендеров.
     * Для построения после создание необходимо вызывать init()
     * @param { DisplayVO } DisplayVO 
     */
    constructor( displayVO = new DisplayVO() ) {

        super();

        this.setVO( displayVO );

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



    /**
     * @param { DisplayVO } vo 
     */
    setVO( vo ) { this.vo = vo; }
    
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