import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";

export default class Module extends EventDispatcherVOWrapper {

    constructor( moduleVO = new moduleVO() ) {
        super( moduleVO );
    }


    //
    // GET/SET
    // 
    get modules() { return this.vo.modules; }
    get application() { return this.modules.application; }

    get size() { return this._size; }
    set size( point ) { this._size = point; }

    get width() { return this._size.x; }
    get height() { return this._size.y; }

    //
    // INIT
    //
    init() { }

    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
    }

}