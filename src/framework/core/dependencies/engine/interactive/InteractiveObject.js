export default class InteractiveObject {

    /**
     * 
     * @param { InteractiveObjectVO } interactiveObjectVO
     */
    constructor( interactiveObjectVO ) {
        super();
        this.vo = interactiveObjectVO;
    }

    //
    // GET/SET
    //

    get inited() { return this._inited; }

    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;
    }

}