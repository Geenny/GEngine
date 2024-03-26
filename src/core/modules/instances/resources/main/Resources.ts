import { injectable, inject, interfaces } from "inversify";
import Dependency from "../../dependency/dependency/Dependency";
import IResources from "./interface/IResources";

@injectable()
export default class Resources extends Dependency implements IResources { }