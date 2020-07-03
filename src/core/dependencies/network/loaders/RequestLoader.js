export default class RequestLoader {

    constructor( params, connector ) {
        this.reset();
        this.params = params;
        this.connector = connector;
        this.content = null;
        this.loaded = 0;
        this.total = 0;
    }

    reset() {
        this.params = null;
        this.connector = null;
        this.state = null;
        this.tries = 0;
        this.content = null;
        this.loaded = 0;
        this.total = 0;
    }
}