import IDependency from "./IDependency";
import IVODependency from "./IVODependency";

export default interface IDependencyStruct {

    ID: number;

    name: string;

    ready?: boolean;

    vo: IVODependency;

    dependency?: IDependency;

}