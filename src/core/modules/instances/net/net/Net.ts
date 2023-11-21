import { injectable, inject, named } from "inversify";
import INet from "./interfaces/INet";
import EventDispatcher from "core/machines/event/EventDispatcher";
import Dependency from "../../dependency/dependency/dependency/Dependency";
import IVO from "../../../construction/vo/interface/IVO";
import { DispatcherType } from "../../dispatcher/types/types";
import { ViewObjectType } from "../../config/types/types";

@injectable()
export default class Net extends Dependency implements INet {

    @inject( ViewObjectType.VO ) @named( "NetVO" )
    protected voData: IVO;

    @inject( DispatcherType.DISPATCHER )
    public eventDispatcher: EventDispatcher;

	// init(): void { }

}