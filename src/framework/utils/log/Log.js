export default class Log {

    static l(... args) {
        args.forEach(object => {
            Log.__l(object)
        })
    }

    static __l(object) {
        console.log(object)
    }

}