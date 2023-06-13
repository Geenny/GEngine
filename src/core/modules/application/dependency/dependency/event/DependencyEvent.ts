import Event from "../../../event/Event";
import Dependency from "../Dependency";

export default class DependencyEvent extends Event {

    public static START: string = "DEPENDENCY.START";
    public static PROGRESS: string = "DEPENDENCY.PROGRESS";
    public static WORKING: string = "DEPENDENCY.WORKING";
    public static STOP: string = "DEPENDENCY.STOP";

    constructor( type: string, public dependency?: Dependency) {
        super( type );
    }

}