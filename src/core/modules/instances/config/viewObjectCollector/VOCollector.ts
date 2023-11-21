import { injectable, inject } from "inversify";
import * as VODATA from "../../../../../config/vo.json";
import IVOCollector from "./interface/IVOCollector";
import { ObjectListAny } from "data/types/commonTypes";

@injectable()
export default class VOCollector implements IVOCollector {

    dataByNameGet( name: string ): ObjectListAny {
        const DATA: ObjectListAny = VODATA || {};
        const source = DATA[ name ];
        source.name = name;
        return source || { };
    }

}