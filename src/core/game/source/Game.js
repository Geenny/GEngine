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

        const containerVO = new DisplayObjectContainerVO().init();
        const container = new DisplayObjectContainer( containerVO );
        container.x = 400;
        container.y = 300;
        this.engine.uistage.addChild( container );

        const container2 = new DisplayObjectContainer( containerVO );
        container2.x = 200;
        container2.y = 0;
        container.addChild( container2 );

        const container3 = new DisplayObjectContainer( containerVO );
        container3.x = 200;
        container3.y = 100;
        container2.addChild( container3 );

        const planeVOData = { textureName: "ButtonInputAtlas" };
        const planeVO = new PlaneObjectVO( planeVOData );
        let plane = new PlaneObject( planeVO );
        plane.x = 300;
        plane.y = 200;
        container3.addChild( plane );

        const textVOData = { text:"Test text. 1,2,3... Test text. 1,2,3... Test text. 1,2,3... Test text. 1,2,3... Test text. 1,2,3..." };
        const textVO = new TextFieldVO( textVOData );
        const text = new TextField( textVO );
        text.x = 0;
        text.y = 20;
        container3.addChild( text );

        const container4 = new DisplayObjectContainer( containerVO );
        container4.x = 300;
        container4.y = 200;
        container3.addChild( container4 );

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

        // // const plane = new PlaneObject( planeVO );
        // // plane.x = 0;
        // // plane.y = 50;
        // // this.engine.uistage.addChild( plane );
        // // this.engine.uistage.scene.add( plane.object3D );

        
        // // const planeVOData = { textureName: "ButtonInputAtlas" };
        // // const planeVO = new SpriteVO( planeVOData );
        // // const plane2 = new PlaneObject( planeVO );
        // // plane2.x = 100;
        // // plane2.y = 0;
        // // this.engine.uistage.addChild( plane2 );

        // // for ( let i = 0; i < 1; i++) {
        // //     let container2 = new DisplayObjectContainer( containerVO );
        // //     container2.x = 300;
        // //     container2.y = 300; // 900 * Math.random();
        // //     container.addChild( container2 );

        // //     let plane = new PlaneObject( planeVO );
        // //     plane.x = 0;
        // //     plane.y = 0;
        // //     container2.addChild( plane );
        // // }

        // this.rotation = 0;

        // setInterval( () => {
        //     // this.rotation += 1;
        //     // for ( let i = 0; i < 5; i++) {
        //     //     container.list[i].list[0].x = 100 * Math.sin( this.rotation * Math.PI / 180 );
        //     //     container.list[i].list[0].y = 100 * Math.cos( this.rotation * Math.PI / 180 );
        //     // }
        //     this.rotation += 0.01;
        //     container.rotation = this.rotation;
        // }, 33);

    }

}