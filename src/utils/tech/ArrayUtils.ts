export default class ArrayUtils {

    /**
     * Проверка содержания в массиве
     * @param { any } value значение для поиска в массиве
     * @param { any[] } list массив в котором осуществляется поиск
     */
    static inArray( value: any, list?: any[] ) {
        return list &&
            list.length > 0 &&
            list.indexOf( value ) != -1;
    }

    /**
     * Вернкуть уникальное значение переменной в поле @valueName массива
     * объектов @list
     * @param { string } valueName 
     * @param { any[] } list 
     */
    static getUniqueNumericValue( valueName: string, list: any[] ): number {
        let value = 1;
        while( ArrayUtils.findAsObject( list, valueName, value ) )
            value ++;
        return value;
    }

    /**
     * Проверить содержится ли значение @value в массиве @list по полю-ключу
     * Ответ возвращается типом @Boolean
     * @key
     * @param { any[] } list 
     * @param { string } key 
     * @param { any } value 
     * @return { boolean }
     */
    static isValueInList( list: any[], key: string, value: any ): boolean {
        return !!ArrayUtils.findAsObject( list, key, value );
    }

    /**
     * Вернуть содержащееся значение по соответствию полей @list[ @key ] и @value
     * @param { any[] } list 
     * @param { string | number } key 
     * @param { any } value 
     * @return {  }
     */
    static findAsObject( list: any[], key: string, value: any ): any[] {
        return list ? list.find( object => object[ key ] === value ) : undefined;
    }

    /**
     * Создать клон экземпляра массива
     * @param { any[] } array 
     */
    static clone( array: any[] ) {
        return array.slice(0);
    }

    /**
     * Найти уникальный ID для списка
     * @param { any[] } list 
     * @param { string } IDName 
     */
    static uniqueIDGet( list: any[], IDName: string = "ID" ): number {
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