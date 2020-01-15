import EventDispathcer from "../../../framework/core/machines/event/EventDispatcher";
import User from "../user/User";
import UserVO from "../user/vo/UserVO";

export default class Game extends EventDispathcer {

    /**
     * 
     * @param { Application } application 
     */
    constructor( application ) {
        super();
        this.application = application;
    }

    //
    // GET/SET
    //

    get inited() { return this._inited; }

    //
    // INIT
    //

    init() {
        this._initUser();
        // this._initMenu();
        this._inited = true;
    }

    _initUser() {
        const userVO = new UserVO( {} );
        this.user = new User( userVO );
    }

}