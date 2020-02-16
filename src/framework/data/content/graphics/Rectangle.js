export default class Rectangle {

    constructor( x = 0, y = 0, width = 0, height = 0 ) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    /**
     * Координата x
     */
    get x() { return this._x; }
    set x( value ) {
        if ( typeof value === 'number' && this._x !== value ) {
            this._x = value;
            this.dirty = true;
        }
    }

    /**
     * Координата y
     */
    get y() { return this._y; }
    set y( value ) {
        if ( typeof value === 'number' && this._y !== value ) {
            this._y = value;
            this.dirty = true;
        }
    }

    get width() { return this._width; }
    set width( value ) {
        if ( typeof value === 'number' && this._width !== value ) {
            this._width = value;
            this.dirty = true;
        }
    }

    get height() { return this._height; }
    set height( value ) {
        if ( typeof value === 'number' && this._height !== value ) {
            this._height = value;
            this.dirty = true;
        }
    }

    get dirty() { return this._squaredDirty; }
    set dirty( value ) {
        this._squaredDirty = value;
    }

    /**
     * Вернуть площадь 
     */
    get squared() {
        if ( this._squaredDirty ) {
            this._squared = this._width * this._height;
            this._squaredDirty = false;
        }
        return this._squared;
    }

    /**
     * Крайние позиции
     */
    get top() { return Math.min( this._y, this._y + this._height ) }
    get bottom() { return Math.max( this._y, this._y + this._height ) }
    get left() { return Math.min( this._x, this._x + this._width ) }
    get right() { return Math.max( this._x, this._x + this._width ) }

    /**
     * 
     * @param { Point } point 
     */
    setPivot( point ) {
        if ( !point || !point.hasOwnProperty( "x" ) || !point.hasOwnProperty( "y" ) ) return;
        this.x = point.x;
        this.y = point.y;
    }

    setSize( point ) {
        if ( !point || !point.hasOwnProperty( "x" ) || !point.hasOwnProperty( "y" ) ) return;
        this.width = point.x;
        this.height = point.y;
    }

    toString() {
        return this._x.toString() + "," + this._y.toString() + "," + this._width.toString() + "," + this._height.toString() + ";";
    }

}