import { inject, injectable } from "inversify";
import IVO from "./interface/IVO";
import IVOContainer from "./interface/IVOContainer";
import IIdentifier from "../identifier/interface/IIdentifier";
import VO from "./VO";
import VOCollector from "../../instances/config/viewObjectCollector/VOCollector";
import Work from "../work/Work";
import { ViewObjectType } from "../../instances/config/types/types";

@injectable()
export default class VOContainer extends Work implements IVOContainer, IIdentifier {

    @inject( ViewObjectType.VO_COLLECTOR )
    protected voCollector: VOCollector;

    protected voSource: IVO;

    public get ID(): number { return this.vo?.ID || 0; }

    public get name(): string { return this.vo?.name || "none"; }


    //
    // INIT
    //

    protected async onInit(): Promise<void> {
        this.initVOValues();
    }

    protected initVOValues(): void {
        const source = this.voCollector.dataByNameGet( this.constructor.name );
        this.voSource = new VO( source );
    }


    //
    // VO
    //

    public get vo(): IVO { return this.voSource || this.voDefaultGet(); }

    protected voDefaultGet(): IVO {
        if ( !this.voSource ) this.voSource = new VO();
        return this.voSource;
    }

}