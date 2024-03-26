import InjectionModule from "../../../machines/injection/module/InjectionModule";
import IApplication from "./main/interface/IApplication";
import IApplicationOptions from "./options/interface/IApplicationOptions";
import Application from "./main/Application";
import ApplicationOptions from "./options/ApplicationOptions";
import { IInjectionContainer } from "core/machines/injection";
import { ApplicationType } from "./types/types";

export default class ApplicationModule extends InjectionModule {

    protected injectElements( containerStruct: IInjectionContainer ): boolean {

        const { container, bind } = containerStruct;

        bind<IApplicationOptions>( ApplicationType.OPTIONS ).to( ApplicationOptions ).inSingletonScope();
        bind<IApplication>( ApplicationType.APPLICATION ).to( Application ).inSingletonScope();

        return true;
    }

}