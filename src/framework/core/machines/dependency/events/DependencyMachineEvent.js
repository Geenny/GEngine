import Event from "../../event/Event";

export default class DependencyMachineEvent extends Event {

    constructor( type ) {
        super( type );
    }
    
}

DependencyMachineEvent.DEPENDENCY_ADD = "dependencyMachineDependencyAdd";
DependencyMachineEvent.DEPENDENCY_REMOVE = "dependencyMachineDependencyRemove";
DependencyMachineEvent.DEPENDENCY_STARTED = "dependencyMachineDependencyStarted";
DependencyMachineEvent.DEPENDENCY_STARTING = "dependencyMachineDependencyStarting";
DependencyMachineEvent.DEPENDENCY_STOPPED = "dependencyMachineDependencyStopped";
DependencyMachineEvent.DEPENDENCY_STOPPING = "dependencyMachineDependencyStopping";
DependencyMachineEvent.DEPENDENCY_ERROR = "dependencyMachineDependencyError";
