import { Container } from "inversify";

export default interface IInjectionModule {

    readonly name?: string;

    containerID?: string;

    inject(container: Container): boolean;

}