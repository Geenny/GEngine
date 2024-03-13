import { injectable, inject } from "inversify";
import * as VODATA from "../../../../../config/vo.json";
import IVOCollector from "./interface/IVOCollector";
import { ObjectListAny } from "data/types/common";
import UtilsObject from "utils/common/UtilsObject";

@injectable()
export default class VOCollector implements IVOCollector {

    private _list: ObjectListAny[];

    get data(): ObjectListAny { return VODATA || { }; }

    get list(): ObjectListAny[] { return this._list; }

    dataByNameGet( name: string ): ObjectListAny {
        this.listCreate();
        const source = this.list.find( data => data.name === name );
        return source || { };
    }

    protected listCreate(): void {
        if ( this.list ) return;
        this._list = UtilsObject.convertToSingleList( this.data, "name" );
    }

}