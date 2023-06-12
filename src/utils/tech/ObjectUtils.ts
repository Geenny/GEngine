export default class ObjectUtils {

    /**
     * Добавление из @source в @object существующих параметров
     * @param { any } object Объект для добавления
     * @param { any } source Объект источник данных
     * @param { boolean } cloneObject добавлять в клон объекта
     */
    static assignExists( object: any, source: any, cloneObject: boolean = false ): any {
        if ( object ) {
            const target = cloneObject ? ObjectUtils.clone( object ) : object;
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
        return !!ObjectUtils.getKeyByValue( source, value );
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
                if ( !ObjectUtils.inValues( source, values[ i ] ) ) {
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
    static cloneHard( object: any ): any {

        function cloneHardLevel( object: any ): any {

            if ( !object ) return object;
            let result: any;

            if ( Array.isArray( object ) ) {
                result = [ ];
                for ( let i = 0; i < object.length; i++ ) {
                    result[ i ] = cloneHardLevel( object[ i ] );
                }
            } else if ( typeof object === "number" || typeof object === "boolean" || typeof object === "string" || typeof object === "function" ) {
                result = object;
            } else if ( typeof object === "object" ) {
                if ( object.constructor && object.constructor.name === "Object" ) {
                    result = { };
                    for ( const key in object ) {
                        result[ key ] = cloneHardLevel( object[ key ] );
                    }
                } else {
                    result = object;
                }
            }

            return result;

        }

        return cloneHardLevel( object );
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
    static noData( object: any ): boolean {
        return ObjectUtils.count( object ) === 0;
    }

    /**
     * Добавить значения @source в @target объекты
     * @param { any } target 
     * @param { any } source 
     */
    static concat( target: any, source: any ): any {
        function concat( target: any, source: any ) {
            if ( !target || !source ) return;
            for ( const key in source ) {
                // if ( typeof source[ key ] != typeof target[ key ]) continue;
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


    /**
     * Вызвать @destroy у списка объектов
     * @param { Array } list 
     */
    static destroyList( list: any[] ): void  {
        if ( !Array.isArray( list ) ) return;
        while( list.length ) {
            const target = list.shift();
            if ( target && target.destroy )
                target.destroy();
        }
    }

}