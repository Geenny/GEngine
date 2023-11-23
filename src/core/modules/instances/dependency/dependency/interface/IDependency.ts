import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import IVOContainer from "core/modules/construction/vo/interface/IVOContainer";
import IVODependency from "./IVODependency";

export default interface IDependency extends IVOContainer {

    readonly ID: number;

    readonly name: string;

    readonly vo: IVODependency;

    readonly isWorking: boolean;

    dispatcher: IEventDispatcher;

}