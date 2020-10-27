import DisplayType from "../../../../displays/constants/DisplayType";
import View from "./View";

export default class PixiView extends View {

    //
    // GET/SET
    //
    get isView() { 
        return this.application.applicationDisplay &&
            this.application.applicationDisplay.type === DisplayType.PIXI;
    }

    /**
     * Stage of PIXI
     */
    get stage() { return this.isView ? this.application.applicationDisplay.pixi.stage : null; }

}