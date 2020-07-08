import Step from "../machines/step/Step";
import ScreenName from "../screens/ScreenName";

export default class ApplicationStep extends Step {

    onStart() {
        const screen = this.screenManager.screenShowByID( ScreenName.APPLICATION );
        this.screenNode = screen.nodeByNameGet( "Main" );
    }

    onStop() { }

}