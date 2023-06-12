export default class MethodUtils {

    /**
     * Проверка метода (функции) на то что это функция и  она существует
     * @param { Function } value сам метод (функция)
     * @return { boolean }
     */
    static isMethod( value: any ): boolean {
        return typeof value === "function"; 
    }

}