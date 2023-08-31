import { interfaces } from "inversify";
import InjectionModule from "../module/InjectionModule";

export default interface IInjectionMachine {

    name?: string;

    start( serviceIdentifier: interfaces.ServiceIdentifier<unknown> ): void;

    injectModule( module: InjectionModule, containerName?: string ): void;

}