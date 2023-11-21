import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IVOCollector from "./viewObjectCollector/interface/IVOCollector";
import VOCollector from "./viewObjectCollector/VOCollector";
import { IInjectionContainer } from "core/machines/injection";
import { ViewObjectType } from "./types/types";

export default class ViewObjectModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { container, bind } = containerStruct;

        bind<IVOCollector>( ViewObjectType.VO_COLLECTOR ).to( VOCollector ).inSingletonScope();

        return true;
    }

}