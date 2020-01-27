import DisplayVO from "../../../vo/DisplayVO";
import Camera from "../constants/Camera";

export default class ThreeJSDisplayVO extends DisplayVO {

    constructor( data ) {
        super( data );
    }

    init() {

        super.init();

        this.rendererID = 1;
        this.rendererName = "WebGLRenderer";

        this.rendererParameters = {
            // canvas: null,
            // context: null,
            precision: "highp", // "highp", "mediump", "lowp"
            // alpha: false,
            premultipliedAlpha: true,
            antialias: false,
            stencil: true,
            preserveDrawingBuffer: false,
            powerPreference: "default", // "high-performance", "low-power", "default"
            failIfMajorPerformanceCaveat: false,
            depth: true,
            logarithmicDepthBuffer: false
        }

        // Prespective camera parameters
        this.camera = {
            type: Camera.PerspectiveCamera,
            near: 0.1,
            far: 1000,
            fov: 50,
            aspect: 1, // width / height
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        this.scene = {
            backgroundColor: 0x222222
        };

        // this.cameraType = Camera.PerspectiveCamera;
        // this.cameraNear = 0.1;
        // this.cameraFar = 1000;

        // Prespective camera parameters
        // this.cameraFov = 50; // 
        // this.cameraAspect = 1; // width / height

    }

}