import EventDispathcer from "../../../framework/core/machines/event/EventDispatcher";
import User from "../user/User";
import UserVO from "../user/vo/UserVO";
import DependencyIDs from "../../../framework/core/dependencies/DependencyIDs";
import DependencyStates from "../../../framework/core/machines/dependency/states/DependencyState";
import SpriteObject from "../../../framework/core/dependencies/engine/content/display/SpriteObject";
import SpriteVO from "../../../framework/core/dependencies/engine/content/display/vo/SpriteVO";

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

    get engine() { return this._engine; }

    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;
        
        this._initUser();
        this._initEngine();
        // this._initMenu();
    }

    _initUser() {
        const userVO = new UserVO( {} );
        this.user = new User( userVO );
    }
    _initEngine() {
        this._engine = this.application.dependencyMachine.dependencyByIDGet( DependencyIDs.ENGINE );
        // if ( engine.state === DependencyStates.WORKING ) {

        // }

        const spriteVO = new SpriteVO();
        const sprite = new SpriteObject( spriteVO );
        this.engine.stage.addChild( sprite );
    }  

}