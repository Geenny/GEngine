import { injectable, inject } from "inversify";
import ApplicationOptions from "../options/ApplicationOptions";
import ApplicationType from "../types/ApplicationType";
import { ObjectListString } from "../types/ApplicationValueTypes";
import ILog from "./interface/ILog";
import LogStyle from "./LogStyle";

@injectable()
export default class Log implements ILog {

    @inject( ApplicationType.OPTIONS )
    public options: ApplicationOptions;

    get style(): ObjectListString { return LogStyle; }

    log( message: any, ...options: any[] ): void {
        if ( !this.options.isLogged ) return;
        options.unshift( message );
        console.log.apply( this, options );//  ( message, ...options );
    }

    warn( message: any, ...options: any[] ): void {
        if ( !this.options.isLogged ) return;
        console.log( message, ...options );
    }

    error( id: string | number, description: string | undefined = undefined, ...options: any[] ): void {
        if ( !this.options.isLogged ) return;
        const message = `Error ID: ${id}, ${description}`;
        console.error( message, ...options )
    }

}