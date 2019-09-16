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
     * @param { object } source 
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
     * Клонировать объект
     * @param { object } object 
     */
    static clone( object ) {
        if ( object )
            return { ... object };
    }

}