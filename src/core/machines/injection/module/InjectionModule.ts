import { Container } from "inversify";
import SelfEntity from "../../../base/VOContainer";
import InjectionName from "../constants/InjectionName";
import IInjectionModule from "../interface/IInjectionModule";

export default class InjectionModule extends SelfEntity implements IInjectionModule {

    private _name: string = this.constructor.name;

    public get name(): string { return this._name; }

    public containerID: string = InjectionName.MAIN;

    public inject( container: Container ): boolean {
        return this.injectElements( container );
    }

    protected injectElements( container: Container ): boolean {
        return true;
    }

}