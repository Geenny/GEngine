import DisplayVO from "../../../vo/DisplayVO";

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

        this.cameraType = "PerspectiveCamera";
        this.cameraNear = 0.1;
        this.cameraFar = 1000;

        // Prespective camera parameters
        this.cameraFov = 50; // 
        this.cameraAspect = 1; // width / height

    }

}