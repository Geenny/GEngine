import InjectionModule from "../../../machines/injection/module/InjectionModule";
import Net from "./net/Net";
import INet from "./net/interfaces/INet";
import { IInjectionContainer } from "core/machines/injection";
import { NetType } from "./types/types";

export default class NetModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { bind } = containerStruct;

        bind<INet>( NetType.NET ).to( Net ).inSingletonScope();

        return true;
    }

}