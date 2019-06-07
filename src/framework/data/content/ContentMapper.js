export default class ContentMapper {

    constructor( map = null ) {
        this.map = {};
        this.parse( map );
        return this;
    }

    /**
     * Заполнение @map из объекта
     * @param { Object } map 
     */
    parse( map ) {
        if ( map ) {
            for ( const key in map ) {
                if ( map[ key ])
                    this.map[ key ] = map[ key ];
            }
        }
        return this;
    }

    get( key ) {
        return this.map[ key ];
    }

    /**
     * Добавить связь
     * @param { string } key 
     * @param { * } link 
     */
    add( key, link ) {
        if ( !this.inMap( key ) && link )
            this.map[ key ] = link;
        return this;
    }

    /**
     * Убрать связь
     * @param { string } key 
     */
    remove( key ) {
        delete this.map[ key ];
        return this;
    }

    /**
     * @param { string } key 
     */
    inMap( key ) {
        return this.map.hasOwnProperty( key )
    }

}