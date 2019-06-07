import Main from "./core/main/Main";
import MainVO from "./core/main/MainVO";

const view = document.getElementById('ApplicationContainer');

const CONFIG = require('./core/config/CONFIG');
const mainVO = new MainVO( CONFIG.MAIN.main.vo );
const application = new Main( view, mainVO );
application.init();
