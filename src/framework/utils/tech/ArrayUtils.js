export default class ArrayUtils {

    /**
     * Проверка содержания в массиве
     * @param {*} value значение для поиска в массиве
     * @param {*} list массив в котором осуществляется поиск
     */
    static inArray( value, list = null ) {
        return list &&
            list.length > 0 &&
            list.indexOf( value ) != -1;
    }

}