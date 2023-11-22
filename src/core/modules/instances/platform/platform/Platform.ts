import { injectable, inject, named } from "inversify";
import Dependency from "../../dependency/dependency/dependency/Dependency";
import IVO from "../../../construction/vo/interface/IVO";
import IPlatform from "./interface/IPlatform";
import { DispatcherType } from "../../dispatcher/types/types";
import { ViewObjectType } from "../../config/types/types";
import { PlatformNameEnum } from "./enum/PlatformNameEnum";
import { PlatformName } from "../types/types";
import { PromiseStruct } from "data/promise/PromiseStruct";
import { promiseStructGet } from "data/promise/methods/methods";
import Log from "utils/log/Log";

@injectable()
export default class Platform extends Dependency implements IPlatform {

    // @inject( ViewObjectType.VO ) @named( "PlatformVO" )
    // protected voData: IVO;
	
    protected promiseReadyStruct: PromiseStruct;

	public platformName: PlatformName = PlatformNameEnum.UNKNOWN;

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