import IEventDispatcher from "./IEventDispatcher";

export default interface IEvent {

    readonly type: string;

    readonly target?: IEventDispatcher;

    setTarget( target: IEventDispatcher ): void;

} 