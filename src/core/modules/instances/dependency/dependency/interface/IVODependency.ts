import IVO from "core/modules/construction/vo/interface/IVO";
import Dependency from "../dependency/Dependency";

export default interface IVODependency extends IVO {

    id: number;

    name: string;

    class: typeof Dependency;

}