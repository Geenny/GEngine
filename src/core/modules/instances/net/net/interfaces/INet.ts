import IDependency from "core/modules/instances/dependency/dependency/interface/IDependency";
import { RequestData } from "../../types/netTypes";
import { ObjectListAny, RecieveMethods } from "data/types/common";
import INetRequest from "./INetRequest";

export default interface INet extends IDependency {

    send( data: RequestData, methods?: RecieveMethods, options?: ObjectListAny ): INetRequest;
    
}