import IWork from "../../work/interface/IWork";
import IVO from "./IVO";

export default interface IVOContainer extends IWork {

    readonly vo: IVO;

}