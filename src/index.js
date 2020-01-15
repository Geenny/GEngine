import Main from "./core/main/Main";
import MainVO from "./core/main/MainVO";

const HTMLElement = document.getElementById('ApplicationContainer');

const CONFIG = require('./core/config/CONFIG');
const mainVO = new MainVO( CONFIG.MAIN.main.vo );
mainVO.HTMLElement = HTMLElement;

const application = new Main( mainVO );
application.init();
window.APP = application;
