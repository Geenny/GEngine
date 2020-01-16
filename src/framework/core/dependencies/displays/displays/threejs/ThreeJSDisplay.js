import AbstractDisplay from "../AbstractDisplay";
import { Scene, PerspectiveCamera, OrthographicCamera, DirectionalLight, BoxGeometry, PlaneGeometry, MeshPhongMaterial, Mesh } from "three";
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
    get uiscene() { return this._uiscene; }

    get cameras() { return this._cameras; }
    get camera() { return this._camera; }
    get uicamera() { return this._uicamera; }

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

        // this.camera.position.y = 100;
        // this.camera.position.z = 100;
	    // this.camera.position.x = 100;
	    this.camera.lookAt(this.scene.position);
        this.camera.position.z = 400;
	    this.uicamera.lookAt(this.uiscene.position);
        this.uicamera.position.z = 900;

        // var light = new DirectionalLight( 0xffffff, 1 );
        // light.position.set( 50, 50, 50 );
        // this.scene.add(light);

        // var geometry = new BoxGeometry( 20, 20, 20 );
        // var material = new MeshPhongMaterial( {color: 0xcccccc} );
        // this.cube = new Mesh( geometry, material );
        // // this.cube.position.z = -800;
        // this.scene.add( this.cube );
        
        // var light2 = new DirectionalLight( 0xffffff, 1 );
        // light2.position.set( 50, 50, 50 );
        // this.uiscene.add(light2);

        // var geometry2 = new PlaneGeometry( 160, 160, 0 );
        // var material2 = new MeshPhongMaterial( { color: 0xff0066 } );
        // this.plane = new Mesh( geometry2, material2 );
        
        // var geometry3 = new PlaneGeometry( 80, 80, 0 );
        // var material3 = new MeshPhongMaterial( { color: 0x330900 } );
        // this.plane2 = new Mesh( geometry3, material3 );

        // var geometry4 = new PlaneGeometry( 60, 60, 0 );
        // var material4 = new MeshPhongMaterial( { color: 0x33b900 } );
        // this.plane3 = new Mesh( geometry4, material4 );
        // this.uiscene.add( this.plane );
        // this.uiscene.add( this.plane2 );
        // this.uiscene.add( this.plane3 );
    }
    initRenderer() {
        const RendererClass = this.rendererClassGet();
        this._renderer = new RendererClass( this.vo.rendererParameters );
        // this._renderer.setClearColor( 0x000000, 0 );
        this._renderer.autoClear = false;
        this.resize( this.size.x, this.size.y );
    }
    initScene() {
        this._scene = new Scene();
        this._uiscene = new Scene();
    }
    initCameras() {
        this._camera = this.cameraCreate( 0, this.cameraType );
        this._uicamera = this.cameraCreate( 1, CameraStruct.OrthographicCamera );
        // this._uicamera = this.cameraCreate( 1, CameraStruct.PerspectiveCamera );
    }
    initViewElement() {
        this.vo.canvas = this._renderer.domElement;
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

    updateCamerasAspect() {
        this.vo.cameraAspect = this.aspect;

        for ( var i = 0; i < this._cameras.length; i++ ) {
            const camera = this._cameras[ i ];
            if (camera instanceof CameraStruct.PerspectiveCamera) {
                camera.aspect = this.aspect;
            } else if (camera instanceof CameraStruct.OrthographicCamera) {
				camera.left = - this.size.x / 2;
				camera.right = this.size.x / 2;
				camera.top = this.size.y / 2;
                camera.bottom = - this.size.y / 2;
            }
            camera.updateProjectionMatrix();
        }
    }

    cameraCreate( ID = 0, type = CameraStruct.PerspectiveCamera ) {
        if ( this._cameras[ ID ] )
            return this._cameras[ ID ];

        const camera = this._cameraCreateByType( type );
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
                    this.vo.cameraNear,
                    this.vo.cameraFar );
            default:
                return new PerspectiveCamera(
                    this.vo.cameraFov,
                    this.vo.cameraAspect,
                    this.vo.cameraNear,
                    this.vo.cameraFar );
        }
    }


    //
    // RESIZE
    //
    resize( width, height ) {
        super.resize( width, height );
        this.updateCamerasAspect();
        this._renderer.setSize( width, height );
    }


    //
    // DRAW
    //

    draw() {
        if ( !this.enable ) return;
        this._renderer.clear();
        this._renderer.render( this._scene, this._camera );
        this._renderer.clearDepth();
        this._renderer.render( this._uiscene, this._uicamera );
        
        // this.cube.rotation.x += 0.005;
        // this.cube.rotation.y -= 0.005;
        // this.cube.rotation.z += 0.01;
        
        // this.plane.position.x = -this.size.x * 0.5 + 80 + 2;
        // this.plane.position.y = -this.size.y * 0.5 + 80 + 2;
        // this.plane2.position.x = -this.size.x * 0.5 + 80 + 2;
        // this.plane2.position.y = -this.size.y * 0.5 + 80 + 2;
        // this.plane3.position.x = -this.size.x * 0.5 + 80 + 2;
        // this.plane3.position.y = -this.size.y * 0.5 + 80 + 2;
    }
}