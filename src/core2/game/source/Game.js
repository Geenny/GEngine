import EventDispathcer from "../../../framework/core/machines/event/EventDispatcher";
import User from "../user/User";
import UserVO from "../user/vo/UserVO";
import DependencyIDs from "../../../framework/core/dependencies/DependencyIDs";
import DependencyStates from "../../../framework/core/machines/dependency/states/DependencyState";
import SpriteObject from "../../../framework/core/dependencies/engine/content/display/SpriteObject";
import SpriteVO from "../../../framework/core/dependencies/engine/content/display/vo/SpriteVO";
import { SpriteMaterial, Sprite, TextureLoader } from "three";
import PlaneObject from "../../../framework/core/dependencies/engine/content/display/PlaneObject";
import DisplayObjectContainerVO from "../../../framework/core/dependencies/engine/content/display/vo/DisplayObjectContainerVO";
import DisplayObjectContainer from "../../../framework/core/dependencies/engine/content/display/DisplayObjectContainer";
import KeyboardEvent from "../../../framework/core/dependencies/systems/keyboard/KeyboardEvent";
import TextField from "../../../framework/core/dependencies/engine/content/display/text/TextField";
import TextFieldVO from "../../../framework/core/dependencies/engine/content/display/text/vo/TextFieldVO";
import PlaneObjectVO from "../../../framework/core/dependencies/engine/content/display/vo/PlaneObjectVO";
import Rectangle from "../../../framework/data/content/graphics/Rectangle";
import Net from "../../../framework/core/dependencies/network/Net";
import Event from "../../../framework/core/machines/event/Event";
import ButtonVO from "../../../framework/core/dependencies/engine/content/display/buttons/vo/ButtonVO";
import Button from "../../../framework/core/dependencies/engine/content/display/buttons/Button";

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

        // const spriteVOData = { textureName: "ButtonInputAtlas" };
        // const spriteVO = new SpriteVO( spriteVOData );
        // const sprite = new SpriteObject( spriteVO );
        // sprite.x = 0;
        // sprite.y = 0;
        // this.engine.uistage.addChild( sprite );

        const containerVO = new DisplayObjectContainerVO();
        const container = new DisplayObjectContainer( containerVO );
        container.x = 400;
        container.y = 300;
        this.engine.uistage.addChild( container );

        // const container2 = new DisplayObjectContainer( containerVO );
        // container2.x = 200;
        // container2.y = 0;
        // container.addChild( container2 );

        // const container3 = new DisplayObjectContainer( containerVO );
        // container3.x = 200;
        // container3.y = 100;
        // container2.addChild( container3 );

        const planeVOData = { textureName: "ButtonInputAtlas", name: "ABC" };
        const planeVO = new PlaneObjectVO( planeVOData );
        let plane = new PlaneObject( planeVO );
        plane.x = 600;
        plane.y = 200;
        container.addChild( plane );

        const textVOData = { text: "Test text. 1,2,3... Test text. 1,2,3...\nTest text. 1,2,3,4,5... Test text. 1,2,3...\nTest text. 1,2,3..." };
        const textVO = new TextFieldVO( textVOData );
        const text = new TextField( textVO );
        text.x = 100;
        text.y = 20;
        text.interactive = true;
        container.addChild( text );

        // const container4 = new DisplayObjectContainer( containerVO );
        // container4.x = 200;
        // container4.y = 100;
        // container3.addChild( container4 );

        // const planeVOData2 = { textureName: "texture_512_512" };
        // const planeVO2 = new PlaneObjectVO( planeVOData2 );
        // let plane2 = new PlaneObject( planeVO2 );
        // plane2.x = 700;
        // plane2.y = 20;
        // container2.addChild( plane2 );

        const buttonVO = new ButtonVO();
        const button = new Button( buttonVO );
        button.y = 200;
        container.addChild( button );

        this.application.addEventListener( KeyboardEvent.DOWN, ( event ) => {
            // if ( event.key === "q") plane.x ++;
            // if ( event.key === "a") plane.x --;
            if ( event.key === "w") container.x ++;
            if ( event.key === "s") container.x --;
            if ( event.key === "e") plane.rotation += 0.05;
            if ( event.key === "d") plane.rotation -= 0.05;
            if ( event.key === "r") container.rotation += 0.05;
            if ( event.key === "f") container.rotation -= 0.05;
            if ( event.key === "t") container2.rotation += 0.05;
            if ( event.key === "g") container2.rotation -= 0.05;
            if ( event.key === "y") container3.rotation += 0.05;
            if ( event.key === "h") container3.rotation -= 0.05;
            if ( event.key === "u") plane.width += 10;
            if ( event.key === "j") plane.width -= 10;
        } );
        

    }

}