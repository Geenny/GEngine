import DisplayType from "../../../../displays/constants/DisplayType";
import View from "./View";

export default class ThreeView extends View {

    //
    // GET/SET
    //
    get isView() { 
        return this.application.applicationDisplay &&
            this.application.applicationDisplay.type === DisplayType.THREE;
    }

    /**
     * Stage as Scene
     */
    get stage() { return this.scene; }

    /**
     * SCENE
     */
    get scene() { return this.isView ? this.application.applicationDisplay.scene : null; }

    /**
     * UI SCENE
     */
    get uiscene() { return this.isView ? this.application.applicationDisplay.uiscene : null; }

}