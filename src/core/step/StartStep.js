import Step from "../machines/step/Step";
import ScreenName from "../screens/ScreenName";

export default class StartStep extends Step {

    onStart() {
        const screen = this.screenManager.screenShowByID( ScreenName.BEGIN );
        this.screenNode = screen.nodeByNameGet( "Main" );
        this.mainContainer = this.screenNode.content;
    }

    onStop() {
        // this._progressBarRemove();
        // this.unsubscribe();
    }

}