export default class Point {

    constructor( x = 0, y = 0 ) {
        this._x = 0;
        this._y = 0;
        this.update( x, y );
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

    get dirty() { return this._squaredDirty; }
    set dirty( value ) {
        this._squaredDirty = value;
    }

    /**
     * Вернуть площадь 
     */
    get squared() {
        if ( this._squaredDirty ) {
            this._squared = this.x * this.y;
            this._squaredDirty = false;
        }
        return this._squared;
    }

    /**
     * Обновить координаты через указание каждого
     * @param { number } x Координата x
     * @param { number } y Координата y
     */
    update( x, y ) {
        if ( typeof x === "number" && this.x !== x ) {
            this.x = x;
            this.dirty = true;
        }
        if ( typeof y === "number" && this.y !== y ) {
            this.y = y;
            this.dirty = true;
        }
    }

    setFromPoint( point ) {
        if ( !point ) return;
        this.update( point.x, point.y );
    }

    toString() {
        return this._x.toString() + "," + this._y.toString() + ";";
    }

}