
import Application from "./core/application/Application";
import ApplicationVO from "./core/application/vo/ApplicationVO";
// import CONFIG from './config/CONFIG';

const CONFIG = require( './config/CONFIG' );

export default class GEngineEntry {

    start() {

        if ( this.started ) return;
        this.started = true;
        this.VO = new ApplicationVO( CONFIG.MAIN.main.vo );

        const HTMLElement = document.getElementById( 'ApplicationContainer' );
        this.VO.HTMLElement = HTMLElement;
    
        window.onload = () => {
            this.onStart();
        };

    }
    
    
    onStart() {
    
        this.application = this.applicationStart();
    
        const onClick = event => {
            if ( !this.application.resourceReady ) return;
            this.application.interaction();
            document.removeEventListener( "click", onClick );
            document.removeEventListener( "touchend", onClick );
        }
    
        document.addEventListener( "click", onClick );
        document.addEventListener( "touchend", onClick );
    
    }
    
    applicationStart() {
        if ( window.g_app ) return window.g_app;
    
        const application = new Application( this.VO );
        application.init();
        window.g_app = application;
    
        return application;
    }
    
    applicationRestart() {
        if ( window.g_app ) {
            window.g_app.destroy();
            window.g_app = null;
        }
    
        return this.applicationStart();
    }

}