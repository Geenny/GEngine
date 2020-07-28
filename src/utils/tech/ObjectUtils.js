export default class ObjectUtils {

    /**
     * Добавление из @source в @object существующих параметров
     * @param { object } object Объект для добавления
     * @param { object } source Объект источник данных
     * @param { Boolean } cloneObject добавлять в клон объекта
     */
    static assignExists( object, source, cloneObject = false ) {
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
     * @param { object } source Простой объект
     * @param { object } value 
     */
    static getKeyByValue( source, value ) {
        if ( source ) {
            for ( const key in source ) {
                if ( source[ key ] != value ) continue;
                return key;
            }
        }
        return null;
    }

    /**
     * @value Содержиться в простом объекте @source
     * @param { object } source Простой объект
     * @param { object } value 
     * @return { boolean }
     */
    static inValues( source, value ) {
        return !!ObjectUtils.getKeyByValue( source, value );
    }

    /**
     * @value Содержиться в простом объекте @source
     * @param { object } source Простой объект
     * @param { Array } values Список значений
     * @return { boolean }
     */
    static allInValues( source, values ) {
        if ( Array.isArray( values ) ) {
            for ( let i = 0; i < values.length; i++ ) {
                if ( !ObjectUtils.inValues( values[ i ] ) ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Клонировать объект
     * @param { object } object 
     */
    static clone( object ) {
        if ( object )
            return { ... object };
    }

    /**
     * Посчитать количество элементов в объекте
     * @param { object } object 
     */
    static count( object ) {
        return object ? Object.keys( object ).length : 0;
    }

    /**
     * Проверить или содержатся данные в объекте
     * @param { object } object 
     */
    static noData( object ) {
        return ObjectUtils.count( object ) === 0;
    }

    /**
     * 
     * @param { Object } target 
     * @param { Object } source 
     */
    static concat( target, source ) {
        function concat( target, source ) {
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
    }

}