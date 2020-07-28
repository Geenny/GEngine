export default class ArrayUtils {

    /**
     * Проверка содержания в массиве
     * @param { * } value значение для поиска в массиве
     * @param { Array } list массив в котором осуществляется поиск
     */
    static inArray( value, list = null ) {
        return list &&
            list.length > 0 &&
            list.indexOf( value ) != -1;
    }

    /**
     * Вернкуть уникальное значение переменной в поле @valueName массива
     * объектов @list
     * @param { string } valueName 
     * @param { Array } list 
     */
    static getUniqueNumericValue( valueName, list = null) {
        let value = 1;
        while( ArrayUtils.findAsObject( list, valueName, value ) )
            value ++;
        return value;
    }

    /**
     * Проверить содержится ли значение @value в массиве @list по полю-ключу
     * Ответ возвращается типом @Boolean
     * @key
     * @param { Array } list 
     * @param { string } key 
     * @param { * } value 
     * @return { Boolean }
     */
    static isValueInList( list, key, value ) {
        return !!ArrayUtils.findAsObject( list, key, value );
    }

    /**
     * Вернуть содержащееся значение по соответствию полей @list[ @key ] и @value
     * @param { Array } list 
     * @param { string | Number } key 
     * @param { * } value 
     * @return { * }
     */
    static findAsObject( list, key, value ) {
        return list ? list.find( object => object[ key ] === value ) : null;
    }

    /**
     * Создать клон экземпляра массива
     * @param { Array } array 
     */
    static clone( array ) {
        return array.slice(0)
    }

    /**
     * Найти уникальный ID для списка
     * @param { Array } list 
     * @param { String } IDName 
     */
    static uniqueIDGet( list, IDName = "ID" ) {
        let uniquieID = 1;
        for ( let i = 0; i < list.length; i++ ) {
            const step = list[ i ];
            if ( step[ IDName ] != uniquieID ) continue;
            i = 0;
            uniquieID ++;
        }
        return uniquieID;
    }

}