import Utils from "../Utils";

export default class UtilsString extends Utils {

    private static _instance: UtilsString;

    static get instance(): UtilsString {
        if ( !UtilsString._instance ) UtilsString._instance = new UtilsString();
        return UtilsString._instance;
    }

	static isString( value: any ): boolean {
		return value && typeof value === "string";
	}

}