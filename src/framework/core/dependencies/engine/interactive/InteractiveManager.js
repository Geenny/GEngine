export default class InteractiveManager {

    get add( interactiveObject ) {
        return InteractiveManager.instance.add( interactiveObject );
    }

    /**
     * @param { InteractiveManagerVO } interactiveManagerVO 
     */
    constructor( interactiveManagerVO ) {
        super();
        this._setVO( interactiveManagerVO );
    }

    //
    // GET/SET
    //

    get inited() { return this._inited; }

    //
    // INIT
    //

    init() {
        this._inited = true;
    }

    _setVO( vo ) { this.vo = vo; }

}