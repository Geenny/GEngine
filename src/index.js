// import Main from "./core/main/Main";
// import MainVO from "./core/main/MainVO";
// import Net from "./framework/core/dependencies/network/Net";

// const HTMLElement = document.getElementById('ApplicationContainer');

// const CONFIG = require('./core/config/CONFIG');
// const mainVO = new MainVO( CONFIG.MAIN.main.vo );
// mainVO.HTMLElement = HTMLElement;

// const application = new Main( mainVO );
// application.init();
// window.APP = application;




import Application from "./core/application/Application";
import ApplicationVO from "./core/application/vo/ApplicationVO";

const HTMLElement = document.getElementById( 'ApplicationContainer' );

const CONFIG = require( './config/CONFIG' );
const VO = new ApplicationVO( CONFIG.MAIN.main.vo );
VO.HTMLElement = HTMLElement;

function onStart() {

    applicationStart();

    document.addEventListener( "click", onClick );
    document.addEventListener( "touchend", onClick );

    function onClick( event ) {
        if ( !application.resourceReady ) return;
        application.interaction();
        document.removeEventListener( "click", onClick );
        document.removeEventListener( "touchend", onClick );
    }

}

function applicationStart() {
    if ( window.g_app ) return;

    const application = new Application( VO );
    application.init();
    window.g_app = application;
}

function applicationRestart() {
    if ( window.g_app ) {
        window.g_app.destroy();
        window.g_app = null;
    }

    applicationStart();
}

window.onload = function() {
    onStart();
};