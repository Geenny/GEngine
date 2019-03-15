export default class ApplicationView {

    constructor( div ) {

        this.div = div;
        this.view = null;

        this.createView();

    }

    createView( options = {} ) {
        if ( this.view ) return;
        const view = document.createElement('canvas');
        this._appendToDiv( view );
        this.view = view;
    }

    /**
     * 
     * @param {*} view Canvas | WebGL
     */
    _appendToDiv( view ) {
        this._clearAllFromDiv();
        this.div.appendChild( view );
    }
    _clearAllFromDiv() {
        while ( this.div && this.div.firstChild ) {
            this.div.removeChild( div.firstChild );
        }
    }

}