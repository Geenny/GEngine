
import Application from "./core/application/Application";
import ApplicationVO from "./core/application/vo/ApplicationVO";
import ObjectUtils from "./utils/tech/ObjectUtils";

const CONFIG = require( './config/CONFIG' );

export default class GEngineEntry {

    constructor( ApplicationVOConfig = null, ApplicationClass = null, ApplicationVOClass = null ) {

        this.ApplicationClass = ApplicationClass;
        this.ApplicationVOClass = ApplicationVOClass;
        this.ApplicationVOConfig = ApplicationVOConfig;

        window.ge_entry = this;

    }

    get applicationVO() {

        const AppVOClass = this.ApplicationVOClass || ApplicationVO;
        const AppVOConfig = ObjectUtils.cloneHard( this.ApplicationVOConfig || CONFIG );
        // const AppVOConfig = this.ApplicationVOConfig || CONFIG;
        const VO = new AppVOClass( AppVOConfig.MAIN.main.vo );

        const HTMLElement = document.getElementById( 'ApplicationContainer' );
        VO.HTMLElement = HTMLElement;

        // debugger;

        return VO;
    }

    start() {

        if ( this.started ) return;
        this.started = true;
    
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
        if ( window.ge_app ) return window.ge_app;
    
        const ApplicationClass = this.ApplicationClass || Application;
        const application = new ApplicationClass( this.applicationVO );
        application.init();
        window.ge_app = application;
    
        return application;
    }
    
    applicationRestart() {
        if ( window.ge_app ) {
            window.ge_app.destroy();
            window.ge_app = null;
        }
    
        return this.applicationStart();
    }

}