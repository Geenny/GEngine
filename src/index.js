import Main from "./core/Main";
import MainVO from "./core/MainVO";

const view = document.getElementById('ApplicationContainer');

const application = new Main( view, new MainVO() );
application.init();