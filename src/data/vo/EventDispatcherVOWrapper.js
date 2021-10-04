import EventDispathcer from "../../core/machines/event/EventDispatcher";
import VO from "./VO";

export default class EventDispatcherVOWrapper extends EventDispathcer {

    
    /**
     * 
     * @param { VO } vo 
     */
    constructor( vo ) {
        super();
        this._setVO( vo );
    }

    _setVO( vo ) {
        if ( vo && vo instanceof VO ) vo.init();
        this.vo = vo;
    }

}