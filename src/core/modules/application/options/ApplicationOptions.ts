import { injectable } from "inversify";
import IApplicationOptions from "./interface/IApplicationOptions";

@injectable()
export default class ApplicationOptions implements IApplicationOptions {

    private _isLogged: boolean = true;
    private _debug: boolean = true;

    public get isLogged(): boolean { return this._isLogged; }
    public set isLogged( value: boolean ) { this._isLogged = value; }

    public get debug(): boolean { return this._debug; }
    public set debug( value: boolean ) { this._debug = value; }

}