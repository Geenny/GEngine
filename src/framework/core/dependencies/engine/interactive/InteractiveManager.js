import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";
import MouseEvent from "../../systems/mouse/MouseEvent";
import InteractiveManagerVO from "./vo/InteractiveManagerVO";
import InteractiveObject from "../content/display/InteractiveObject";
import { Raycaster, Vector2 } from "three";

export default class InteractiveManager extends EventDispatcherVOWrapper {

    /**
     * @param { InteractiveManagerVO } interactiveManagerVO 
     */
    constructor( interactiveManagerVO = new InteractiveManagerVO() ) {
        super( interactiveManagerVO );
    }

    //
    // GET/SET
    //

    get stage() { return this.vo.stage; }
    get application() { return this.vo.stage.application; }
    get engine() { return this.vo.stage.engine; }
    get scene() { return this.vo.stage.scene; }
    get camera() { return this.vo.stage.camera; }

    get width() { return this.engine.width; }
    get height() { return this.engine.height; }

    get isMouse() { return this._isMouse; }
    get mouse() { return this._mouse; }
    get raycastMouse() { return this._raycastMouse; }

    //
    // INIT
    //

    init() {
        this._initVars();
        this._initRaycaster();
        this._initMouseEvents();
    }

    _initVars() {
        this._isMouse = true;
        this._list = [];
        this._mouse = new Vector2();
        this._raycastMouse = new Vector2();

        this.interactiveObjectCatch = null;
        this.interactiveObjectClicked = false;
        this.interactiveObjectClickInstance = null;
    }

    _initRaycaster() {
        this.raycaster = new Raycaster()
    }

    _initMouseEvents() {
        if ( !this.application ) return;

        this._onClick = this._onClick.bind( this );
        this._onDown = this._onDown.bind( this );
        this._onUp = this._onUp.bind( this );
        this._onMove = this._onMove.bind( this );
        this._onEnter = this._onEnter.bind( this );
        this._onLeave = this._onLeave.bind( this );

        this.application.addEventListener( MouseEvent.CLICK, this._onClick );
        this.application.addEventListener( MouseEvent.DOWN, this._onDown );
        this.application.addEventListener( MouseEvent.UP, this._onUp );
        this.application.addEventListener( MouseEvent.MOVE, this._onMove );
        this.application.addEventListener( MouseEvent.ENTER, this._onEnter );
        this.application.addEventListener( MouseEvent.LEAVE, this._onLeave );
    }

    _onClick( event ) {}
    _onDown( event ) {
        this._interactiveObjectDown();
    }
    _onUp( event ) {
        this._interactiveObjectUp();
    }
    _onMove( event ) {
        this._mouse.x = event.x;
        this._mouse.y = event.y;
        this._raycastMouse.x = ( event.x / this.width ) * 2 - 1;
        this._raycastMouse.y = -( event.y / this.height ) * 2 + 1;
    }
    _onEnter( event ) {
        this._isMouse = true;
    }
    _onLeave( event ) {
        this._isMouse = false;
    }


    //
    // INTERACTIVE OBJECTs
    //

    add( interactiveObject ) {
        if ( !( interactiveObject instanceof InteractiveObject ) ) return;
        this._list.push( interactiveObject ); 
    }

    remove( interactiveObject ) {
        const index = this._list.indexOf( interactiveObject );
        if ( index >= 0 ) this._list.splice( index, 1 );
    }

    _interactiveObjectHit( interactiveObject ) {
        if ( this.interactiveObjectCatch === interactiveObject ) {
            this._interactiveObjectMove();
        } else {
            if ( this.interactiveObjectCatch ) this._interactiveObjectUnroll();
            this._interactiveObjectRoll( interactiveObject );
        }
    }

    _interactiveObjectRoll( interactiveObject ) {
        if ( this.interactiveObjectCatch ) return;
        this.interactiveObjectCatch = interactiveObject;
        this.interactiveObjectCatch.dispatchEvent( new MouseEvent( MouseEvent.OVER, this.mouse.x, this.mouse.y ) );
    }

    _interactiveObjectUnroll() {
        if ( !this.interactiveObjectCatch ) return;
        this._interactiveObjectUp();

        this.interactiveObjectCatch.dispatchEvent( new MouseEvent( MouseEvent.OUT, this.mouse.x, this.mouse.y ) );
        this.interactiveObjectCatch = null;
    }

    _interactiveObjectDown() {
        if ( !this.interactiveObjectCatch ) return;
        this.interactiveObjectClicked = true;
        this.interactiveObjectClickInstance = this.interactiveObjectCatch;
        this.interactiveObjectCatch.dispatchEvent( new MouseEvent( MouseEvent.DOWN, this.mouse.x, this.mouse.y ) );
    }

    _interactiveObjectUp() {
        if ( !this.interactiveObjectCatch ) return;
        if ( !this.interactiveObjectClicked ) return;
        this.interactiveObjectCatch.dispatchEvent( new MouseEvent( MouseEvent.UP, this.mouse.x, this.mouse.y ) );
        this.interactiveObjectClicked = false;

        if ( this.interactiveObjectClickInstance != this.interactiveObjectCatch ) return;
        this.interactiveObjectCatch.dispatchEvent( new MouseEvent( MouseEvent.CLICK, this.mouse.x, this.mouse.y ) );
        this.interactiveObjectClickInstance = null;
    }

    _interactiveObjectMove() {
        if ( !this.interactiveObjectCatch ) return;
        this.interactiveObjectCatch.dispatchEvent( new MouseEvent( MouseEvent.MOVE, this.mouse.x, this.mouse.y ) );
    }


    //
    // CALC
    //

    intersect( interactiveObject3DList ) {
        this.raycaster.setFromCamera( this.raycastMouse, this.camera );
        const intersects = this.raycaster.intersectObjects( interactiveObject3DList );
        if ( intersects.length > 0 ) {
            let find = false;
            for ( let i = 0; !find && i < this._list.length; i++ ) {
                const interactiveObject = this._list[ i ];
                for ( let j = 0; !find && j < intersects.length; j++ ) {
                    const intersect = intersects[ j ];
                    if ( intersect.object != interactiveObject.object3D ) continue;
                    find = true;
                    this._interactiveObjectHit( interactiveObject );
                }
            }
        } else {
            this._interactiveObjectUnroll();
        }
    }

}