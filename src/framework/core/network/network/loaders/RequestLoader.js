export default class RequestLoader {
    constructor( data, connector ) {
        this.data = data;
        this.connector = connector;
        
        this.state = null;
        this.tries = 0;
    }
}