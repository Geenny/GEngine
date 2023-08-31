import IEvent from "./IEvent";

export default interface IEventDispatcher {

    dispatchEvent( event: IEvent ): IEventDispatcher;

    hasEventListener( type: string, handler?: Function | undefined ): boolean;

    addEventListener( type: string, handler: Function, context?: IEventDispatcher ): IEventDispatcher | undefined;

    removeEventListener( type: string, handler?: Function ): IEventDispatcher | undefined;

    removeAllListeners(): IEventDispatcher;

    stopPropagation(): void;

}