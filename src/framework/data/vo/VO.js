export default class VO {

    constructor( data ) {
        this.init();
        this.parse( data );
    }

    /**
     * Инициализация @VO любыми значениями по умолчанию.
     */
    init() { }

    parse( data ) {
        this.dataSet( data );
    }

    dataSet( data ) {
        if ( data ) {
            for ( const key in data ) {
                this[ key ] = data[ key ];
            }
        }
    }

}