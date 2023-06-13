import { Container } from "inversify";

export default interface IInjectionContainer {

    containerID: string;

    container: Container;

    decorators: any;

}