import { injectable, inject } from "inversify";
import * as VODATA from "../../../../../config/vo.json";
import IVOCollector from "./interface/IVOCollector";
import { NAME, ObjectListAny } from "data/types/common";
import { UtilsNumber, UtilsObject } from "utils/common";
import { Log } from "utils/log";

const UNIQUE_VO: string = "vo";

@injectable()
export default class VOCollector implements IVOCollector {

    private _list: ObjectListAny[];

    get list(): ObjectListAny[] { return this._list; }

    get data(): ObjectListAny { return VODATA || { }; }

    dataByNameGet( name: NAME ): ObjectListAny {
        if ( !this.list ) this.listCreate();

        let source = this.list.find( data => data.name === name );

        if ( !source ) source = this.dataAsException( name );

        return source || { };
    }

    protected listCreate(): void {
        if ( this.list ) return;

        const list = this.listToSingleListDefine( this.data );
        this.listUniqueIDCreate( list );

        this._list = list;
    }

    protected listToSingleListDefine( data: ObjectListAny ): ObjectListAny[] {
        return UtilsObject.convertToSingleList( data, "name" );
    }

    protected listUniqueIDCreate( list: ObjectListAny[] ): void {
        list.forEach( child => {
            child.ID = UtilsNumber.unique( UNIQUE_VO );
        } );
    }


    //
    // EXCEPTION DATA
    //

    protected dataAsException( name: NAME ): ObjectListAny {
        Log.w( `SYSTEM: Not find VO data: ${ name }` );

        return { name, dependent: [] }
    }

}