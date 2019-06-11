import Application from "../../framework/core/application/Application";
import MainVO from "./MainVO";
import Event from "../../framework/core/machines/event/Event";
import { Tween } from "@createjs/tweenjs";
import DependencyMachineEvent from "../../framework/core/machines/dependency/events/DependencyMachineEvent";
import Net from "../../framework/core/network/network/Net";
import Log from "../../framework/utils/log/Log";


export default class Main extends Application {

    constructor( HTMLElement, mainVO = new MainVO() ) {
        super( HTMLElement, mainVO );
        this.addEventListener( DependencyMachineEvent.DEPENDENCY_STARTED, ( event ) => {
            Net.send( { q:'Apple' } );
        } );
    }

    init() {
        super.init();
        this.addEventListener( Event.ANY, this.onEvent, this );


        Tween;
    }

    onEvent( event ) {
        // Log.l( event );
    }

}