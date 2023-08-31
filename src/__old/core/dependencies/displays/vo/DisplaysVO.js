import DependencyVO from "../../../machines/dependency/vo/DependencyVO";
// import ThreeJSDisplay from "../displays/threejs/ThreeJSDisplay";
// import ThreeJSDisplayVO from "../displays/threejs/vo/ThreeJSDisplayVO";
import { DISPLAY_SYSTEM_NAME } from "../../../constants/CONSTANTS";
import PixiJSDisplay from "../displays/pixijs/PixiJSDisplay";
import PixiJSDisplayVO from "../displays/pixijs/vo/PixiJSDisplayVO";

export default class DisplaysVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        super.initVars();
        
        this.fps = 60;
        this.autoRender = true;

        this.displayStructList = [
            // {
            //     class: ThreeJSDisplay,
            //     classVO: ThreeJSDisplayVO,
            //     options: {}
            // },
            {
                class: PixiJSDisplay,
                classVO: PixiJSDisplayVO,
                options: {}
            }
        ];

        this.displaySystemName = DISPLAY_SYSTEM_NAME;
    }

}