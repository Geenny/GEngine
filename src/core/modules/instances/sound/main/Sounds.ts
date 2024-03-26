import { injectable, inject, interfaces } from "inversify";
import Dependency from "../../dependency/dependency/Dependency";
import ISounds from "./interface/ISounds";

@injectable()
export default class Sounds extends Dependency implements ISounds { }