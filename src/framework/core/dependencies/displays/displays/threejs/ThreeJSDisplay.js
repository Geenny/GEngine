import AbstractDisplay from "../AbstractDisplay";
import { Scene, PerspectiveCamera, OrthographicCamera } from "three";
import RendererStruct from "./struct/RendererStruct";
import RendererEnum from "./enum/RendererEnum";
import CameraStruct from "./struct/CameraStruct";
import CameraEnum from "./enum/CameraEnum";
import ObjectUtils from "../../../../../utils/tech/ObjectUtils";

export default class ThreeJSDisplay extends AbstractDisplay {

    constructor( displayVO ) {

        super( displayVO );

    }


    //
    // GET/SET
    //
    
    get renderer() { return this._renderer; }

    get scene() { return this._scene; }

    get cameras() { return this._cameras; }

    get camera() { return this._camera; }
    set camera( value ) { this._camera = value; }

    get cameraType() { return this.vo.cameraType || CameraStruct.PerspectiveCamera; }

    get cameraNear() { return this.vo.sceneNear; }
    get cameraFar() { return this.vo.sceneFar; }

    
    //
    // INIT
    //

    initVars() {

        this._enable = true;
        this._cameras = [];

        this.initScene();
        this.initCameras();
        this.initRenderer();
        this.initViewElement();
    }
    initRenderer() {
        const RendererClass = this.rendererClassGet();
        this._renderer = new RendererClass( this.vo.rendererParameters );
    }
    initScene() {
        this._scene = new Scene();
    }
    initCameras() {
        this.camera = this.cameraCreate();
    }
    initViewElement() {
        this.viewElement = this._renderer.domElement;
    }


    //
    // RENDERER
    //

    rendererClassGet() {
        let RendererClass = RendererStruct.WebGLRenderer;
        if ( RendererStruct.hasOwnProperty( this.vo.rendererName ) ) {
            RendererClass = RendererStruct[ this.vo.rendererName ];
        } else {
            const rendererName = ObjectUtils.getKeyByValue( RendererEnum, this.vo.rendererID );
            RendererClass = RendererStruct[ rendererName ] || RendererClass;
        }
        return RendererClass;
    }


    //
    // CAMERA
    //

    cameraCreate( ID = 0 ) {
        if ( this._cameras[ ID ] )
            return this._cameras[ ID ];

        const camera = this._cameraCreateByType( this.cameraType );
        this._cameras[ ID ] = camera;
        return camera;
    }

    _cameraCreateByType( type ) {
        switch( type ) {
            case CameraStruct.OrthographicCamera:
                return new OrthographicCamera(
                    this.vo.cameraLeft,
                    this.vo.cameraRight,
                    this.vo.cameraTop,
                    this.vo.cameraBottom,
                    this.cameraNear,
                    this.cameraFar );
            default:
                return new PerspectiveCamera(
                    this.vo.cameraFov,
                    this.vo.cameraAspect,
                    this.cameraNear,
                    this.cameraFar );
        }
    }


    //
    // RESIZE
    //
    resize( width, height ) {
        super.resize( width, height );
        this.vo.cameraAspect = width / height;
        this._renderer.setSize( width, height );
    }


    //
    // DRAW
    //

    draw() {
        if ( !this.enable ) return;
        this._renderer.render( this._scene, this._camera );
    }
}