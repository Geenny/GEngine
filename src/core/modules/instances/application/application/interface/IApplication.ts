import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";

export default interface IApplication {

    eventDispatcher: IEventDispatcher;

}