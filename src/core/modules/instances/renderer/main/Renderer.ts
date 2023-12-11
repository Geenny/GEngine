import { injectable } from "inversify";
import Dependency from "../../dependency/dependency/Dependency";
import IRenderer from "./interface/IRenderer";

@injectable()
export default class Renderer extends Dependency implements IRenderer {

	protected HTMLElementName: string = "ApplicationContainer";
	protected HTMLInfoElementName: string = "InfoContainer";

	public HTMLInfoElement: HTMLElement;

	public HTMLElement: HTMLElement;

	public renderer: any;

	public canvas: any;

	public view: any;

	public get isView(): boolean { return !!this.view; }

	protected async onInit(): Promise<void> {
		await super.onInit();

		this.elementInit();
		this.renderInit();
	}


	//
	// ELEMENTS
	//

	protected elementInit(): void {
		this.elementAppliactionInit();
		this.elementInfoInit();
	}

	protected elementAppliactionInit(): void {
		this.HTMLElement = document.getElementById( this.HTMLElementName );
	}

	protected elementInfoInit(): void {
		this.HTMLInfoElement = document.getElementById( this.HTMLInfoElementName );
	}


	//
	// RENDER
	//

	protected renderInit(): void {
		this.rendererInit();
		this.canvasInit();
		this.viewInit();
	}

	protected viewInit(): void {

	}

	protected canvasInit(): void {

	}

	protected rendererInit(): void {

	}

}