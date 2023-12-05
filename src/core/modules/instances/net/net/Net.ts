import { injectable, inject, named } from "inversify";
import INet from "./interfaces/INet";
import Dependency from "../../dependency/dependency/Dependency";
import IVO from "../../../construction/vo/interface/IVO";
import { DispatcherType } from "../../dispatcher/types/types";
import { ViewObjectType } from "../../config/types/types";
import { PromiseStruct } from "data/promise/PromiseStruct";
import { promiseStructGet } from "data/promise/methods/methods";
import Log from "utils/log/Log";

@injectable()
export default class Net extends Dependency implements INet {

    // @inject( ViewObjectType.VO ) @named( "NetVO" )
    // protected voData: IVO;

    protected promiseReadyStruct: PromiseStruct;

    // TODO Refactor & Think how it should work
	public server: any;


    //
    // INIT
    //

    protected async onInit(): Promise<void> {
        await super.onInit();
        this.promiseReadyStructInit();
    }


    //
    // START
    //

    protected async onStart(): Promise<void> {
        await super.onStart();
        if (!this.promiseReadyStruct)
            debugger;

        setTimeout( () => this.promiseReadyStruct.resolve(), 500 );

        await this.promiseReadyStruct.promise;
    }


    //
    // PROMISE READY
    //

    protected promiseReadyStructInit(): void {
        this.promiseReadyStruct = promiseStructGet( this );
    }

}