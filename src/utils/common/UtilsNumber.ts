import Utils from "../Utils";

export default class UtilsNumber extends Utils {

    private static _instance: UtilsNumber;

    static get instance(): UtilsNumber {
        if ( !UtilsNumber._instance ) UtilsNumber._instance = new UtilsNumber();
        return UtilsNumber._instance;
    }

	static isNumber( value: any ): boolean {
		return typeof value === "number";
	}

	static isFloat( value: any ): boolean {
		const isNumber = UtilsNumber.isNumber( value );
		if ( !isNumber ) return false;
		const part = value % 1;
		return isNumber && part < 1;
	}

	static isFloatPositive( value: any ): boolean {
		const isNumber = UtilsNumber.isNumber( value );
		if ( !isNumber ) return false;
		return isNumber && value >> 0 >= 0 && value % 1 >= 0;
	}

	static isFloatNegative( value: any ): boolean {
		const isNumber = UtilsNumber.isNumber( value );
		if ( !isNumber ) return false;
		return isNumber && value < 0;
	}

}