import { ObjectListAny } from "data/types/commonTypes";

export default interface IVO {

    readonly ID: number;

    readonly name: string;

    source: ObjectListAny;

    nameSet( name: string ): void;

}