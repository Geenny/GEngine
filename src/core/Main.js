import Application from "../framework/core/application/Application";
import MainVO from "./MainVO";

export default class Main extends Application {

    constructor( HTMLElement, mainVO = new MainVO() ) {
        super( HTMLElement, mainVO );
    }

}