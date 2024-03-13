import { injectable } from "inversify";
import IVO from "./interface/IVO";
import IVOContainer from "./interface/IVOContainer";
import { ID, ObjectListAny } from "data/types/common";

@injectable()
export default class VO implements IVO {

    private _source: ObjectListAny;

    public ID: ID;
    public name: string;
    public options: any;

	public get source(): ObjectListAny { return this._source; };
	public set source( data: ObjectListAny ) {
        if ( !data ) return;

        for ( let name in data ) {
            if ( name === "name" && data[ name ] ) {
                this.name = data[ name ];
            } else {
                // @ts-ignore
                this[ name ] = data[ name ];
            }
        }
    };

    constructor( source: ObjectListAny = { } ) {
        this.source = source;
    }

    nameSet( name: string ): void {
        this.name = name;
    }

}