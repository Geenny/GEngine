import { ID } from "data/types/common";
import IDependency from "./IDependency";
import IVODependency from "./IVODependency";

export default interface IDependencyStruct {

    ID: ID;

    name: string;

    ready?: boolean;

    vo: IVODependency;

    dependency?: IDependency;

}