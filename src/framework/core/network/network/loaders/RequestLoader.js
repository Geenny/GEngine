export default class RequestLoader {

    constructor( params, connector ) {
        this.reset();
        this.params = params;
        this.connector = connector;
        this.data = null;
    }

    reset() {
        this.params = null;
        this.connector = null;
        this.state = null;
        this.tries = 0;
    }
}