import { injectable, inject, interfaces } from "inversify";
import ILoaderManager from "./interface/ILoaderManager";
import IVOLoaderManager from "./interface/IVOLoaderManager";
import Dependency from "../../dependency/dependency/Dependency";

@injectable()
export default class LoaderManager extends Dependency implements ILoaderManager {

    // protected voSource: IVOLoaderManager;

}