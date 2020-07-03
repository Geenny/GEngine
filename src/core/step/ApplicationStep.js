import Step from "../../../framework/core/machines/step/Step";
import ScreenName from "../../screens/ScreenName";
import Sounds from "../../../framework/core/dependencies/engine/modules/modules/sound/Sounds";

export default class LogoCoStep extends Step {

    onStart() {
        this.logoCoScreenShow();
    }

    logoCoScreenShow() {
        if ( !this.application || !this.application.screenManager ) return;
        const screen = this.application.screenManager.screenShowByID( ScreenName.LOGO_CO );
        this.screenNode = screen.nodeByNameGet( "Logo" );
        this.screenNode.content.ready = () => {
            this.stop();
        }

        Sounds.play( "LogoCoSound", { start: 0.5, volume: 0.2 } );
    }

    onStop() {
        Sounds.stop( "LogoCoSound" );
        this.screenNode.content.ready = null;
    }

}