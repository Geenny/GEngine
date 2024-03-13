import IProcess from "../../process/interface/IProcess";
import IVO from "./IVO";

export default interface IVOContainer extends IProcess {

    readonly vo: IVO;

}