import EventDispathcer from "../../../framework/core/machines/event/EventDispatcher";
import FriendManager from "./friends/FriendManager";

export default class User extends EventDispathcer {

    /**
     * 
     * @param { UserVO } userVO 
     */
    constructor( userVO ) {
        super();
        this.setVO( userVO );
    }

    //
    // GET/SET
    //

    get inited() { return this._inited; }
    get raw() { return this._raw; }
    get profile() { return this._profile; }
    get friendManager() { return this._friendManager; }

    //
    // INIT
    //

    init() {
        this._initVars();
        this._inited = true;
    }

    setVO( vo ) {
        this.vo = vo;
    }

    _initVars() {
        this._raw = {};
        this._profile = new Profile();
        this._friendManager = new FriendManager();
    }

}