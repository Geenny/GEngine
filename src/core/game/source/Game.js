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
        container.x = 0;
        container.y = 0;
        this.engine.uistage.addChild( container );

        


        const planeVOData = { textureName: "ButtonInputAtlas" };
        const planeVO = new SpriteVO( planeVOData );
        // const plane = new PlaneObject( planeVO );
        // plane.x = 0;
        // plane.y = 50;
        // this.engine.uistage.addChild( plane );
        // this.engine.uistage.scene.add( plane.object3D );

        
        // const planeVOData = { textureName: "ButtonInputAtlas" };
        // const planeVO = new SpriteVO( planeVOData );
        // const plane2 = new PlaneObject( planeVO );
        // plane2.x = 100;
        // plane2.y = 0;
        // this.engine.uistage.addChild( plane2 );

        for ( let i = 0; i < 5; i++) {
            let container2 = new DisplayObjectContainer( containerVO );
            container2.x = 400;
            container2.y = 900 * Math.random();
            container.addChild( container2 );

            let plane = new PlaneObject( planeVO );
            container2.addChild( plane );
        }

        this.rotation = 0;

        setInterval( () => {
            this.rotation += 0.01;
            // for ( let i = 0; i < 5; i++) {
            //     container.list[i].list[0].x = 100 * Math.sin( this.rotation * Math.PI / 180 );
            //     container.list[i].list[0].y = 100 * Math.cos( this.rotation * Math.PI / 180 );
            // }
            for ( let i = 0; i < 5; i++) {
                container.list[i].rotation = this.rotation;
            }
        }, 33);

    }

}