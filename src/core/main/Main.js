import Application from "../../framework/core/application/Application";
import MainVO from "./MainVO";
import Event from "../../framework/core/machines/event/Event";
import { Tween } from "@createjs/tweenjs";
import DependencyMachineEvent from "../../framework/core/machines/dependency/events/DependencyMachineEvent";
import Net from "../../framework/core/dependencies/network/network/Net";
import Log from "../../framework/utils/log/Log";


export default class Main extends Application {

    constructor( mainVO = new MainVO() ) {
        super( mainVO );
        this.addEventListener( DependencyMachineEvent.DEPENDENCY_STARTED, ( event ) => {
            // for ( let i = 0; i < 1; i++ ) {
            //     Net.send( { q:['Crying','shedding','tears','welling','eyes','response'][~~(Math.random() * 6)] } );
            // }
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