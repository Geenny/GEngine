import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import DisplaysVO from "./vo/DisplaysVO";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
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
    get display() { return this._displayStruct ? this._displayStruct.instance : null; }

    /**
     * DisplaySturct
     */
    get displayStruct() { return this._displayStruct; }
    set displayStruct( value ) {
        if ( !value || this._displayStruct === value ) return;
        this._displayStruct = value;
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
        const displaySystem = this.displaySystemGet();
        if ( !displaySystem ) return;
        displaySystem.sizeUpdate();
        this.size = displaySystem.size;
    }

    displaySystemGet() {
        return this.application.dependencies && this.application.dependencies.systems ?
            this.application.dependencies.systems.systemGetByName( this.vo.displaySystemName ) : null;
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
        this.initTicker();
        this.applicationDisplaySet();
        this.startComplete();
    }

    stopProcess() {
        this.unsubscribe();
        this.stopComplete();
        this._htmlElementClear();
    }



    //
    // DISPLAYS
    // 

    /**
     * Вернуть @Display по его имени
     * @param {String} name 
     */
    displayByNameGet( name ) {
        const displayStruct = ArrayUtils.findAsObject( this.displayStructList, "name", name );
        if ( displayStruct.display ) this._displayStruct = displayStruct;
        return displayStruct.display;
    }

    displayDefaultGet() {
        return this.displayStructList[ 0 ];
    }

    updateDisplay() {
        this._updateViewElement();
    }

    _updateViewElement() {
        if ( !this.htmlElement || !this.display || !this.viewElement ) return;
        this._htmlElementClear();
        this.htmlElement.appendChild( this.viewElement );
    }

    _displaysCreate() {
        for ( let i = 0; i < this.displayStructList.length; i++ ) {
            const displayStruct = this.displayStructList[ i ];
            this._displayCreateByDisplayStruct( displayStruct );
        }
    }

    _displayDeafultInit() {
        if ( this.displayStruct ) return;
        this.displayStruct = this.displayDefaultGet();
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
        // TODO Make ticker
        this.application.tickerMachine.addMethod(() => {
            if ( this.display ) this.display.draw();
        });
    }


    //
    // APPLICATION DISPLAY SET
    //
    applicationDisplaySet() {
        if ( !this.display ) return;
        this.application.applicationDisplay = this.display;
    }
}