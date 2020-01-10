export default class MethodUtils {

    /**
     * Проверка метода (функции) на то что это функция и  она существует
     * @param { Function } value сам метод (функция)
     */
    static isMethod( value ) {
        return typeof value === "function"; 
    }

}