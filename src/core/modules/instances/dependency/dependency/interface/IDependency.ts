import IVOContainer from "core/modules/construction/vo/interface/IVOContainer";

export default interface IDependency extends IVOContainer {

    readonly isWorking: boolean;

}