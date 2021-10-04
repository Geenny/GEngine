export default class VO {

    constructor( data ) {
        this.source = { };
        this.initVars();
        this.parse( data );
    }

    init() {
        for ( const key in this.source ) {
            this[ key ] = this.source[ key ];
        }
        return this;
    }

    /**
     * Инициализация переменных @VO любыми значениями по умолчанию.
     */
    initVars() { }

    parse( data ) {
        this.dataSet( data );
        return this;
    }

    /**
     * Добавление данных из объекта
     * @param {object} data 
     */
    dataSet( data ) {
        if ( !data ) return;
        this.source = Object.assign( this.source, data );
    }

}