import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import DisplaysVO from "./vo/DisplaysVO";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
import StructList from "../../../data/content/structList/StructList";
import DisplayVO from "./vo/DisplayVO";
import DisplayStruct from "./struct/DisplayStruct";
import ResizeEvent from "../systems/display/ResizeEvent";
import DisplayEvent from "./event/DisplayEvent";
import Point from "../../../data/content/graphics/Point";

export default class Displays extends DependencyAbstract {

    /**
     * 
     * @param {SystemsVO} systemsVO Наследник @DependencyVO
     */
    constructor( displaysVO = new DisplaysVO() ) {
        super( displaysVO );
    }

    //
    // GET/SET
    //

    /**
     * Выбранный вид
     */
    get display() { return this._displaySturct ? this._displaySturct.instance : null; }

    /**
     * DisplaySturct
     */
    get displaySturct() { return this._displaySturct; }
    set displaySturct( value ) {
        if ( !value || this._displaySturct === value ) return;
        this._displaySturct = value;
        this.updateDisplay();
    }

    /**
     * Список @DisplayStruct
     */
    get displayStructList() { return this.vo.displayStructList; }

    /**
     * HTML Element
     * Элемент, зачастую div, в который вкладывается создаваемый @viewElement
     */
    get htmlElement() { return this._htmlElement; }
    set htmlElement( value ) {
        if ( this._htmlElement == value ) return;
        this._htmlElement = value;
        this.updateDisplay();
    }

    /**
     * VIEW Element
     * Элемент, созданный определенным @AbstarctDisplay
     */
    get viewElement() { return this.display.viewElement; }

    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
    }
    _initVars() {
        this.size = new Point();
        this._view = null;
        this._displayStructList = [];
    }
    _initHtmlElement() {
        this.htmlElement = this.application.HTMLElement;
    }
    subscribe() {
        this.application.addEventListener( ResizeEvent.RESIZE, this.onResize, this );
    }
    unsubscribe() {
        this.application.removeEventListener( ResizeEvent.RESIZE, this.onResize, this );
    }


    //
    // RESIZE
    //

    onResize( event ) {
        if ( !this.display ) return;
        this.sizeSet( event.width, event.height );
        this.display.resize( event.width, event.height );
    }

    sizeSet( width, height ) {
        this.size.update( width, height );
    }

    sizeUpdate() {
        const displaySystem = this.application.systems.systemGetByName( this.vo.displaySystemName );
        displaySystem.sizeUpdate();
        this.size = displaySystem.size;
    }


    //
    // SYSTEMS
    //

    /**
     * 
     */
    startProcess() {
        this.sizeUpdate();
        this._displaysCreate();
        this._displayDeafultInit();
        this._initHtmlElement();
        this.subscribe();
        this.startComplete();
    }

    stopProcess() {
        this.stopComplete();
    }



    //
    // DISPLAYS
    // 

    /**
     * Вернуть @Display по его имени
     * @param {String} name 
     */
    displayByNameGet( name ) {
        const displayStruct = ArrayUtils.findValueAsObject( this.displayStructList, "name", name );
        if ( displayStruct.display ) this._displaySturct = displayStruct;
        return displayStruct.display;
    }

    displayDefaultGet() {
        return this.displayStructList[ 0 ];
    }

    updateDisplay() {
        this._updateViewElement();
        this.initTicker();
    }

    _updateViewElement() {
        if ( !this.htmlElement || !this.display || !this.display.viewElement ) return;
        this._htmlElementClear();
        this.htmlElement.appendChild( this.display.viewElement );
    }

    _displaysCreate() {
        for ( let i = 0; i < this.displayStructList.length; i++ ) {
            const displayStruct = this.displayStructList[ i ];
            this._displayCreateByDisplayStruct( displayStruct );
        }
    }

    _displayDeafultInit() {
        if ( this.displaySturct ) return;
        this.displaySturct = this.displayDefaultGet();
    }

    _displayCreateByDisplayStruct( displayStruct ) {
        if ( !displayStruct ) return false;

        const DisplayClass = displayStruct.class ? displayStruct.class : null;
        const DisplayVOClass = displayStruct.classVO || DisplaysVO;
        const displayVO = new DisplayVOClass( displayStruct.options || {} );
        const display = DisplayClass ? new DisplayClass( displayVO ) : null;

        display.addEventListener( DisplayEvent.VEIW_ELEMENT_READY, this._onDisplayReady, this );

        display.size.setFromPoint( this.size );
        display.init();

        displayStruct.instance = display;
        displayStruct.instanceVO = displayVO;

        return !!display;
    }

    _onDisplayReady( event ) {
        this._htmlElementAddByDisplayReady( event.target );
    }

    _htmlElementAddByDisplayReady( display ) {
        if ( this.display !== display ) return;
        this.updateDisplay();
    }
    _htmlElementClear() {
        while ( this.htmlElement.firstChild ) {
            this.htmlElement.removeChild( this.htmlElement.firstChild );
        }
    }


    //
    // TICKER
    //

    initTicker() {
        // TODO Make tikcker
        setInterval(() => {
            if ( this.display ) this.display.draw();
        }, 1000 / 60);
    }
}