import IEvent from "./interface/IEvent";
import EventDispatcher from "./EventDispatcher";

export default class Event implements IEvent {

    public static ANY: string = "ANY";
    public static ACTIVE: string = "ACTIVE";
    public static DEACTIVE: string = "DEACTIVE";
    public static COMPLETE: string = "COMPLETE";

    protected _type: string;
    protected _target: EventDispatcher | undefined;

    constructor( type: string ) {
        this._type = type;
        this._target = undefined;
    }

    public get type(): string { return this._type; }

    public get target(): EventDispatcher | undefined { return this._target; }

    public setTarget( target: EventDispatcher ): void { this._target = target; }

}