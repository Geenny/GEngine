import InjectionModule from "../module/InjectionModule";
import IInjectionElement from "./IInjectionElement";

export default interface IInjectionMachine {

    name?: string;

    start(): void;

    injectModule( module: InjectionModule, containerName?: string ): void;

}