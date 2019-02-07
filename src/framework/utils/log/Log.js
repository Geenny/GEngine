export default class Log() {

    l(... args) {
        args.forEach(object => {
            __l(object)
        })
    }

    __l(object) {
        console.log(object)
    }

}