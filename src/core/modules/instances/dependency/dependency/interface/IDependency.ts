import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import IVOContainer from "core/modules/construction/vo/interface/IVOContainer";

export default interface IDependency extends IVOContainer {

    readonly isWorking: boolean;

    dispatcher: IEventDispatcher;

}