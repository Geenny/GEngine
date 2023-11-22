import { injectable } from "inversify";
import Dependency from "../../dependency/dependency/dependency/Dependency";
import IPlatform from "./interface/IPlatform";
import { PlatformNameEnum } from "./enum/PlatformNameEnum";
import { PlatformName } from "../types/types";
import { PromiseStruct } from "data/promise/PromiseStruct";
import { promiseStructGet } from "data/promise/methods/methods";

@injectable()
export default class Platform extends Dependency implements IPlatform {
	
    protected promiseReadyStruct: PromiseStruct;

	public platformName: PlatformName = PlatformNameEnum.UNKNOWN;


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
        await this.platformInit();
    }


	//
	// PLATFROM INIT
	//

	protected async platformInit(): Promise<void> {
        if (!this.promiseReadyStruct)
            debugger;
        setTimeout( () => this.promiseReadyStruct.resolve(), 1000 );
		await this.promiseReadyStruct.promise;
	}


    //
    // PROMISE READY
    //

    protected promiseReadyStructInit(): void {
        this.promiseReadyStruct = promiseStructGet( this );
    }

}