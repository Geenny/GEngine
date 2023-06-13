import { ObjectListString } from "../../types/ApplicationValueTypes";

export default interface ILog {

    style: ObjectListString;

    log( message: any, ...options: any[] ): void;

    warn( message: any, ...options: any[] ): void;

    error( id: string, description: string, ...options: any[] ): void;

}