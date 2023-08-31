import InjectionName from "../constants/InjectionName";
import IInjectionModule from "../interface/IInjectionModule";
import VOContainer from "../../../base/VOContainer";
import IInjectionContainer from "../interface/IInjectionContainer";

export default class InjectionModule extends VOContainer implements IInjectionModule {

    private _name: string = this.constructor.name;

    public get name(): string { return this._name; }

    public containerID: string = InjectionName.MAIN;

    public inject( containerStruct: IInjectionContainer ): boolean {
        return this.injectElements( containerStruct );
    }

    protected injectElements( containerStruct: IInjectionContainer ): boolean {
        return true;
    }

}