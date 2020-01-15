import DependencyVO from "../../../machines/dependency/vo/DependencyVO";
import ThreeJSDisplay from "../displays/threejs/ThreeJSDisplay";
import ThreeJSDisplayVO from "../displays/threejs/vo/ThreeJSDisplayVO";
import { DISPLAY_SYSTEM_NAME } from "../../../../constants/Constants";

export default class DisplaysVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    init() {
        super.init();

        this.fps = 60;
        this.autoRender = true;

        this.displayStructList = [
            {
                class: ThreeJSDisplay,
                classVO: ThreeJSDisplayVO,
                options: {}
            }
        ];

        this.displaySystemName = DISPLAY_SYSTEM_NAME;
    }

}