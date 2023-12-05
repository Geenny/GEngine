import { injectable } from "inversify";
import Dependency from "../../dependency/dependency/Dependency";
import IRenderer from "./interface/IRenderer";

@injectable()
export default class Renderer extends Dependency implements IRenderer {

}