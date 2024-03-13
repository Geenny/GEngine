import { ID, ObjectListAny } from "data/types/common";

export default interface IVO {

    readonly ID: ID;

    readonly name: string;

    readonly options: any;

    source: ObjectListAny;

    nameSet( name: string ): void;

}