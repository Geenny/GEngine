import { injectable } from "inversify";
import Dependency from "../../dependency/dependency/dependency/Dependency";
import ISystemMachine from "./interface/ISystemMachine";

@injectable()
export default class SystemMachine extends Dependency implements ISystemMachine {

}