// import Application from "./core/application/Application";
// import ApplicationVO from "./core/application/vo/ApplicationVO";

// const HTMLElement = document.getElementById( 'ApplicationContainer' );

// const CONFIG = require( './config/CONFIG' );
// const VO = new ApplicationVO( CONFIG.MAIN.main.vo );
// VO.HTMLElement = HTMLElement;

// function onStart() {

//     const application = applicationStart();

//     document.addEventListener( "click", onClick );
//     document.addEventListener( "touchend", onClick );

//     function onClick( event ) {
//         if ( !application.resourceReady ) return;
//         application.interaction();
//         document.removeEventListener( "click", onClick );
//         document.removeEventListener( "touchend", onClick );
//     }

// }

// function applicationStart() {
//     if ( window.g_app ) return window.g_app;

//     const application = new Application( VO );
//     application.init();
//     window.g_app = application;

//     return application;
// }

// function applicationRestart() {
//     if ( window.g_app ) {
//         window.g_app.destroy();
//         window.g_app = null;
//     }

//     return applicationStart();
// }

// window.onload = function() {
//     onStart();
// };




// import Main from "./core/main/Main";
// import MainVO from "./core/main/MainVO";

// const HTMLElement = document.getElementById('ApplicationContainer');

// const CONFIG = require('./core/config/CONFIG');
// const mainVO = new MainVO( CONFIG.MAIN.main.vo );
// mainVO.HTMLElement = HTMLElement;

// const application = new Main( mainVO );
// application.init();



import GEngineEntry from "./GEngineEntry";
import Log from "./utils/log/Log";
import ArrayUtils from "./utils/tech/ArrayUtils";
import MethodUtils from "./utils/tech/MethodUtils";
import ObjectUtils from "./utils/tech/ObjectUtils";
import StringUtils from "./utils/tech/StringUtils";
import Application from "./core/application/Application";
import ApplicationVO from "./core/application/vo/ApplicationVO";
import ApplicationEvent from "./core/application/event/ApplicationEvent";

export { GEngineEntry, Log, ArrayUtils, MethodUtils, ObjectUtils, StringUtils, Application, ApplicationVO, ApplicationEvent };
// exports.Log = Log;
// exports.ArrayUtils = ArrayUtils;
// exports.MethodUtils = MethodUtils;
// exports.ObjectUtils = ObjectUtils;
// exports.StringUtils = StringUtils;
// exports.Application = Application;
// exports.ApplicationVO = ApplicationVO;

