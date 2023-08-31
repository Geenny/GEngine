import IInjectionContainer from "./IInjectionContainer";

export default interface IInjectionModule {

    readonly name?: string;

    containerID?: string;

    inject( containerStruct: IInjectionContainer ): boolean;

}