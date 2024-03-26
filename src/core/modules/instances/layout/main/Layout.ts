import { injectable, inject, interfaces } from "inversify";
import Dependency from "../../dependency/dependency/Dependency";
import ILayout from "./interface/ILayout";

@injectable()
export default class Layout extends Dependency implements ILayout { }