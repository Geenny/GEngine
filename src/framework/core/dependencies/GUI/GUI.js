import DependencyAbstract from "../../machines/dependency/DependencyAbstract";
import ViewsVO from "./vo/GUIVO";
import ArrayUtils from "../../../utils/tech/ArrayUtils";
import StructList from "../../../data/content/structList/StructList";
import DisplayVO from "./vo/DisplayVO";
import DisplayStruct from "./struct/DisplayStruct";
import ResizeEvent from "../systems/display/ResizeEvent";

export default class Views extends DependencyAbstract {

    /**
     * 
     * @param {SystemsVO} systemsVO Наследник @DependencyVO
     */
    constructor( viewsVO = new ViewsVO() ) {
        super();
    }

    //
    // GET/SET
    //

    /**
     * Выбранный вид
     */
    get display() { return this._displaySturct ? this._displaySturct.display : null; }

    /**
     * DisplaySturct
     */
    get displaySturct() { return this._displaySturct; }
    set displaySturct( value ) {
        if ( !value || this._displaySturct === value ) return;
        this._displaySturct = value;
    }

    /**
     * Список @DisplayStruct
     */
    get displayStructList() { return this.vo.displayStructList; }

    /**
     * HTML Element
     */
    get htmlElement() { return this._htmlElement; }
    set htmlElement( value ) {
        if ( this._htmlElement == value ) return;
        this._htmlElement = value;
        // this.updateView();
    }

    /**
     * VIEW Element
     */
    get viewElement() { return this._viewElement; }
    set viewElement( value ) {
        if ( this._viewElement == value ) return;
        this._viewElement = value;
        // this.updateView();
    }

    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
        this._displaysCreate();
        this.subscribe();
    }
    _initVars() {
        this._view = null;
        this._displayStructList = [];
    }
    subscribe() {
        this.application.addEventListener( ResizeEvent.RESIZE, this.onResize );
    }
    unsubscribe() {
        this.application.removeEventListener( ResizeEvent.RESIZE, this.onResize );
    }

    onResize( event ) {
        if ( !this.display ) return;
        this.display.resize( event.width, event.height );
    }


    //
    // SYSTEMS
    //

    /**
     * 
     */
    startProcess() {
        this._displaysCreate();
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
        return this.displayStructList
    }

    _displaysCreate() {
        // if ( this.displayStructList.length === 0 ) {
        //     this._displayCreateByDisplayStruct( { ...DisplayStruct } );
        // }

        for ( let i = 0; i < this.displayStructList.length; i++ ) {
            const displayStruct = this.displayStructList[ i ];
            this._displayCreateByDisplayStruct( displayStruct );
        }
    }

    _displayCreateByDisplayStruct( displayStruct ) {
        if ( !displayStruct ) return false;
        const DisplayClass = displayStruct.class ? displayStruct.class : null;
        const displayVO = displayStruct.displayVO || new DisplayVO();
        const display = DisplayClass ? new DisplayClass( displayStruct ) : null;
        displayStruct.instanse = display;
        displayStruct.instanseVO = displayVO;
        return !!display;
    }




    


    // createView() {
    //     this._createCanvasDefault();
    //     this._mergeViewElements();
    // }

    // _createCanvasDefault() {
    //     this._canvas = document.createElement('canvas');
    // }

    // _mergeViewElements() {
    //     if ( this.htmlElement &&
    //          this.canvas &&
    //          !this.htmlElement.contains( this.canvas ) )
    //     {
    //         this._appendToDiv( this.canvas );
    //     }
    // }

    // /**
    //  * 
    //  * @param {*} view Canvas | WebGL
    //  */
    // _appendToDiv( canvas ) {
    //     this._clearAllFromDiv();
    //     this.htmlElement.appendChild( canvas );
    // }
    // _clearAllFromDiv() {
    //     while ( this.div && this.div.firstChild ) {
    //         this.div.removeChild( div.firstChild );
    //     }
    // }
}