import EventDispatcherVOWrapper from "../../../../../data/vo/EventDispatcherVOWrapper";
import ScreenVO from "./vo/ScreenVO";

export default class Screen extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { ScreenVO } screenVO
     */
    constructor( screenVO = new ScreenVO() ) {
        super( screenVO );
    }

    show() { }

    hide() { }

}