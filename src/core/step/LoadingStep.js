import Step from "../../../framework/core/machines/step/Step";
import ScreenName from "../../screens/ScreenName";
import Sounds from "../../../framework/core/dependencies/engine/modules/modules/sound/Sounds";

export default class LogoStep extends Step {

    onStart() {
        this.logoScreenShow();
        this.logoTimeoutStart();
    }

    logoScreenShow() {
        if ( !this.application || !this.application.screenManager ) return;
        this.screen = this.application.screenManager.screenShowByID( ScreenName.LOGO );
    }

    logoTimeoutStart() {
        if ( this.timeout ) return;
        this.timeout = setTimeout( () => {
            this.stop();
        }, 3000 );
    }

    onStop() {
        if ( this.timeout ) clearTimeout( this.timeout );

        Sounds.play( "ThemeMusic", { start: 1, volume: 0.5, loop: true } );
    }

}