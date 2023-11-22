import IDependency from "core/modules/instances/dependency/dependency/interface/IDependency";
import { PlatformName } from "../../types/types";

export default interface IPlatform extends IDependency {

	readonly platformName: PlatformName;

}