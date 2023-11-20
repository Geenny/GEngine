import InjectionModule from "../../../machines/injection/module/InjectionModule";
import { IInjectionContainer } from "core/machines/injection";
import { DispatcherType } from "./types/types";
import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import EventDispatcher from "core/machines/event/EventDispatcher";

export default class DispatcherModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;
		
        bind<IEventDispatcher>( DispatcherType.DISPATCHER ).to( EventDispatcher ).inSingletonScope();

        return true;
    }

}