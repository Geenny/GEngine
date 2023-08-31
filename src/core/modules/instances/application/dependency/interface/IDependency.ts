import IWork from "data/worker/IWork";
import { StateName } from "data/types/types";

export default interface IDependency extends IWork {

    readonly ID: number;

    readonly name: string;

    state: number;

}