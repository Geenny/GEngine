import Application from "../../framework/core/application/Application";
import MainVO from "./MainVO";
import Event from "../../framework/core/machines/event/Event";
import { Tween } from "@createjs/tweenjs";


export default class Main extends Application {

    constructor( HTMLElement, mainVO = new MainVO() ) {
        super( HTMLElement, mainVO );
    }

    init() {
        super.init();
        this.addEventListener( Event.ANY, this.onEvent, this );

        Tween;
    }

    onEvent( event ) { }

}