import IDependency from "core/modules/instances/dependency/dependency/interface/IDependency";

export default interface IRenderer extends IDependency {

	readonly isView: boolean;

	canvas: any;

	renderer: any;

	view: any;

}