import IVO from "core/modules/construction/vo/interface/IVO";

export default interface IVODependency extends IVO {

    readonly dependent: number[];

}