import Event from "../../event/Event";

export default class DependencyEvent extends Event {

    constructor( type ) {
        super( type );
    }
    
}

DependencyEvent.STARTED = "dependencyStarted";
DependencyEvent.STARTING = "dependencyStarting";
DependencyEvent.STOPPED = "dependencyStopped";
DependencyEvent.STOPPING = "dependencyStopping";
DependencyEvent.WORKING = "dependencyWorking";
DependencyEvent.ERROR = "dependencyError";
