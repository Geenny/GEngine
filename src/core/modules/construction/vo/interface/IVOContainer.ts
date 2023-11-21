import IInit from "../../init/interface/IInit";
import IWork from "../../worker/interface/IWork";
import IVO from "./IVO";

export default interface IVOContainer extends IWork, IInit {

    readonly vo: IVO;

}