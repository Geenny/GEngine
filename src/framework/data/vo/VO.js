export default class VO {

    constructor( data ) {
        this.source = { };
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

    /**
     * Добавление данных из объекта
     * @param {object} data 
     */
    dataSet( data ) {
        if ( data ) {
            this.source = Object.assign( data, this.source );
            for ( const key in data ) {
                this[ key ] = data[ key ];
            }
        }
    }

}