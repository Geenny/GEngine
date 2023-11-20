import { injectable, inject } from "inversify";
import INet from "./interfaces/INet";
import EventDispatcher from "core/machines/event/EventDispatcher";
import Dependency from "../../dependency/dependency/dependency/Dependency";
import { DispatcherType } from "../../dispatcher/types/types";

@injectable()
export default class Net extends Dependency implements INet {

    @inject( DispatcherType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

	init(): void { }

}