import Utils from "../Utils";

export default class UtilsObject extends Utils {

    private static _instance: UtilsObject;

    static get instance(): UtilsObject {
        if ( !UtilsObject._instance ) UtilsObject._instance = new UtilsObject();
        return UtilsObject._instance;
    }

    /**
     * Добавление из @source в @object существующих параметров
     * @param { any } object Объект для добавления
     * @param { any } source Объект источник данных
     * @param { boolean } cloneObject добавлять в клон объекта
     */
    static assignExists( object: any, source: any, cloneObject: boolean = false ): any {
        if ( object ) {
            const target = cloneObject ? UtilsObject.clone( object ) : object;
            if ( source ) {
                for ( const key in source ) {
                    if ( target.hasOwnProperty( key ) ) {
                        target[ key ] = source[ key ];
                    }
                }
            }
            return target;
        }
        return { ... source };
    }

    /**
     * Вернуть ключ по совпадению значения
     * @param { any } source Простой объект
     * @param { any } value 
     * @return { string | undefined } 
     */
    static getKeyByValue( source: any, value: any ): string | undefined {
        if ( source ) {
            for ( const key in source ) {
                if ( source[ key ] != value ) continue;
                return key;
            }
        }
        return undefined;
    }

    /**
     * @value Содержиться в простом объекте @source
     * @param { any } source Простой объект
     * @param { any } value 
     * @return { boolean }
     */
    static inValues( source: any, value: any ): boolean {
        return !!UtilsObject.getKeyByValue( source, value );
    }

    /**
     * @value Содержиться в простом объекте @source
     * @param { object } source Простой объект
     * @param { any } values Список значений
     * @return { boolean }
     */
    static allInValues( source: any, values: any[] ): boolean {
        if ( Array.isArray( values ) ) {
            for ( let i = 0; i < values.length; i++ ) {
                if ( !UtilsObject.inValues( source, values[ i ] ) ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Клонировать объект
     * @param { any } object 
     */
    static clone( object: any ): any {
        if ( object )
            return { ... object };
    }

    /**
     * Создать новый глубоко склонированный объект
     * @param { any } object
     * @return { any } 
     */
    static cloneDeep( object: any ): any {

        function cloneDeepLevel( object: any ): any {

            if ( !object ) return object;
            let result: any;

            if ( Array.isArray( object ) ) {
                result = [ ];
                for ( let i = 0; i < object.length; i++ ) {
                    result[ i ] = cloneDeepLevel( object[ i ] );
                }
            } else if ( typeof object === "number" || typeof object === "boolean" || typeof object === "string" || typeof object === "function" ) {
                result = object;
            } else if ( typeof object === "object" ) {
                if ( object.constructor && object.constructor.name === "Object" ) {
                    result = { };
                    for ( const key in object ) {
                        result[ key ] = cloneDeepLevel( object[ key ] );
                    }
                } else {
                    result = object;
                }
            }

            return result;

        }

        return cloneDeepLevel( object );
    }

    /**
     * Посчитать количество элементов в объекте
     * @param { object } object 
     * @return { number } 
     */
    static count( object: any | undefined ): number {
        return object ? Object.keys( object ).length : 0;
    }

    /**
     * Проверить или содержатся данные в объекте
     * @param { object } object
     * @return { boolean } 
     */
    static isData( object: any ): boolean {
        return UtilsObject.count( object ) > 0;
    }

    /**
     * Добавить значения @source в @target объекты
     * @param { any } target в
     * @param { any } source откуда
     */
    static concat( target: any, source: any ): any {
        function concat( target: any, source: any ) {
            if ( !target || !source ) return;
            for ( const key in source ) {
                if ( typeof source[ key ] === "object" && !Array.isArray( source[ key ] ) ) {
                    if ( !target[ key ] ) target[ key ] = {};
                    concat( target[ key ], source[ key ] );
                } else {
                    target[ key ] = source[ key ];
                }
            }
        }

        concat( target, source );

        return target;
    }

}