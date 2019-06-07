export default class AbstractSender {

    constructor( serverStruct ) {
        init( serverStruct );
    }


    //
    // GET/SET
    //

    get type() { return this.struct.type || null; }

    init( serverStruct ) {

    }

    /**
     * 
     * @param {object} data 
     */
    send( data ) { return null; }

}