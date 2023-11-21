export default interface IInit {

	readonly isInit: boolean;

	init(): IInit;

	destroy(): IInit;

}