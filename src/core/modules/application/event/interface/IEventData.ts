import IEventDispatcher from "./IEventDispatcher";

export default interface IEventData {

    type: string;
    handler: Function;
    context?: IEventDispatcher;
    binded?: Function;
    useCapture?: boolean;
    priority?: number;

}