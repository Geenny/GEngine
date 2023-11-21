import IInit from "./interface/IInit";

export default class Init implements IInit {

	private _isInit: boolean = false;

	public get isInit(): boolean { return this._isInit; }

	init(): IInit {
		this.processInit();
		return this;
	}

	destroy(): IInit {
		this.processDestroy();
		return this;
	}

	protected processInit(): void {
		this.readyInit();
	}
	protected processDestroy(): void {
		this.readyDestroy();
	}

	protected readyInit(): void {
		this._isInit = true;
	}
	protected readyDestroy(): void {
		this._isInit = false;
	}

}