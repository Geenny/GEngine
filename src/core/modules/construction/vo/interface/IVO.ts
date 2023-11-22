import { ObjectListAny } from "data/types/commonTypes";

export default interface IVO {

    readonly ID: number;

    readonly name: string;

    readonly options: any;

    source: ObjectListAny;

    nameSet( name: string ): void;

}