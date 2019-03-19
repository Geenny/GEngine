export default class ApplicationView {

    constructor( htmlElement ) {

        this.htmlElement = htmlElement;

        this.createView();

    }

    get htmlElement() { return this._htmlElement; }
    set htmlElement( value ) {
        this._htmlElement = value;
        this._mergeViewElements();
    }

    /**
     * Модуль результата рендерера Canvas | WebGL
     */
    get view() { return this._view; }
    set view( value ) {
        this._view = value;
        this._mergeViewElements();
    }

    createView() {
        this._createCanvasDefault();
        this._mergeViewElements();
    }

    _createCanvasDefault() {
        const canvas = document.createElement('canvas');
        this.view = canvas;
    }

    _mergeViewElements() {
        if ( this.htmlElement &&
             this.view &&
             !this.htmlElement.contains( this.view ) )
        {
            this._appendToDiv( this.view );
        }
    }

    /**
     * 
     * @param {*} view Canvas | WebGL
     */
    _appendToDiv( view ) {
        this._clearAllFromDiv();
        this.htmlElement.appendChild( view );
    }
    _clearAllFromDiv() {
        while ( this.div && this.div.firstChild ) {
            this.div.removeChild( div.firstChild );
        }
    }

}