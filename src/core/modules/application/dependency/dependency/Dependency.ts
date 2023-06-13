import { injectable, inject } from "inversify";
import DependencyAbstract from "./DependencyAbstract";

@injectable()
export default class Dependency extends DependencyAbstract {

    protected startProcess(): void {
        this.startComplete();
    }

    protected stopProcess(): void {
        this.stopComplete();
    }

}