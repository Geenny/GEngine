import Event from "core/machines/event/Event";
import Dependency from "../../dependency/Dependency";
import DependencyMachine from "../DependencyMachine";

export default class DependencyMachineEvent extends Event {

    public static readonly ADD: string = "DEPENDENCY.MACHINE.ADD";
    public static readonly REMOVE: string = "DEPENDENCY.MACHINE.REMOVE";
    public static readonly STARTING: string = "DEPENDENCY.MACHINE.STARTING";
    public static readonly STARTED: string = "DEPENDENCY.MACHINE.STARTED";
    public static readonly STOPPING: string = "DEPENDENCY.MACHINE.STOPPING";
    public static readonly STOPPED: string = "DEPENDENCY.MACHINE.STOPPED";
    public static readonly ERROR: string = "DEPENDENCY.MACHINE.ERROR";

    public readonly dependencyMachine?: DependencyMachine;
    public readonly dependency?: Dependency;
    
    constructor( type: string, dependencyMachine?: DependencyMachine, dependency?: Dependency ) {
        super( type );

        this.dependencyMachine = dependencyMachine;
        this.dependency = dependency;
    }

}