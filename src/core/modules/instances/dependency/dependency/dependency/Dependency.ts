import { injectable, inject } from "inversify";
import DependencyAbstract from "./DependencyAbstract";

@injectable()
export default class Dependency extends DependencyAbstract {

    protected processStart(): void {
        super.processStart();
        this.startComplete();
    }

    protected processStop(): void {
        super.processStop();
        this.stopComplete();
    }

}