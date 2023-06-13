import Point from "./Point";

export default class Polygon {

    constructor( points = [] ) {
        this._list = [];
        this.addPoints( points );
    }

    get length() { return this._list.length; }

    addPoints( points ) {
        if ( !Array.isArray( points ) ) return;
        for ( let i = 0; i < this._list.length; i++ ) {
            this.addPoint( this._list[ i ] );
        }
    }

    addPoint( point ) {
        if ( point.hasOwnProperty( "x" ) && point.hasOwnProperty( "y" ) ) {
            let correctionPoint = ( point instanceof Point ) ? point : new Point( point.x, point.y );
            this._list.push( correctionPoint );
        }
    }

}