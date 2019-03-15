import EventDispathcer from "../../machines/event/EventDispatcher";

export default class SystemAbstract extends EventDispathcer {

    constructor() {
        if ( new.target === SystemAbstract ) {
            throw new TypeError("Cannot construct SystemAbstract instances directly");
        }
    }

}