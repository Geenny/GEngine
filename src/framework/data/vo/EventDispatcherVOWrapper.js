import EventDispathcer from "../../core/machines/event/EventDispatcher";

export default class EventDispatcherVOWrapper extends EventDispathcer {

    
    /**
     * 
     * @param { VO } vo 
     */
    constructor( vo ) {
        super();
        this._setVO( vo );
    }

    _setVO( vo ) { this.vo = vo; }

}