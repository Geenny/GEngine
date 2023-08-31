import Utils from "../Utils";

export default class UtilArray extends Utils {

    private static _instance: UtilArray;

    static get instance(): UtilArray {
        if ( !UtilArray._instance ) UtilArray._instance = new UtilArray();
        return UtilArray._instance;
    }

    static findByParameterName( list: any[], name: string, parameter: any ): any | undefined {
        if (!list || !name || !parameter) return undefined;

        for ( let i = 0; i < list.length; i++ ) {
            const object: any = list[ i ];
            if ( object[ name ] === parameter )
                return object;
        }

        return undefined;
    }

    static findIndexByParameterName( list: any[], name: string, parameter: any ): number {
        if (!list || !name || !parameter) return -1;

        for ( let i = 0; i < list.length; i++ ) {
            const object: any = list[ i ];
            if ( object[ name ] === parameter )
                return i;
        }

        return -1;
    }

}