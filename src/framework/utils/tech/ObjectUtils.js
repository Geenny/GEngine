export default class ObjectUtils {

    /**
     * Добавление из @source в @object существующих параметров
     * @param {*} object Объект для добавления
     * @param {*} source Объект источник данных
     * @param {Boolean} cloneObject добавлять в клон объекта
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
     * Клонировать объект
     * @param {*} object 
     */
    static clone( object ) {
        if ( object )
            return { ... object };
    }

}