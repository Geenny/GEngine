import Point from "./Point";

export default class Rectangle {

    constructor( x = 0, y = 0, width = 0, height = 0, angle = 0 ) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.angle = angle;
        this._anchor = new Point();
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

    /**
     * Высота
     */
    get width() { return this._width; }
    set width( value ) {
        if ( typeof value === 'number' && this._width !== value ) {
            this._width = value;
            this.dirty = true;
        }
    }

    /**
     * Ширина
     */
    get height() { return this._height; }
    set height( value ) {
        if ( typeof value === 'number' && this._height !== value ) {
            this._height = value;
            this.dirty = true;
        }
    }

    get angle() { return this._angle; }
    set angle( value ) {
        if ( typeof value === 'number' && this._angle !== value ) {
            this._angle = value % Math.PI2;
            this.dirty = true;
        }
    }

    get anchor() { return this._anchor; }
    set anchor( value ) {
        if ( value && value.hasOwnProperty( "x" ) && typeof value.x === 'number' ) {
            this._anchor.x = value.x;
            this.dirty = true;
        }
        if ( value && value.hasOwnProperty( "y" ) && typeof value.y === 'number' ) {
            this._anchor.y = value.y;
            this.dirty = true;
        }
    }

    get dirty() { return this._squaredDirty || this._angleDirty; }
    set dirty( value ) {
        this._squaredDirty = value;
        this._angleDirty = value;
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
     * Крайняя верхняя позиция
     */
    get top() {
        if ( this._angleDirty ) this.updateAngle();
        return Math.min( this._leftTop.y, this._leftBottom.y, this._rightTop.y, this._rightBottom.y );
    }
    get bottom() {
        if ( this._angleDirty ) this.updateAngle();
        return Math.max( this._leftTop.y, this._leftBottom.y, this._rightTop.y, this._rightBottom.y );
    }
    get left() {
        if ( this._angleDirty ) this.updateAngle();
        return Math.min( this._leftTop.x, this._leftBottom.x, this._rightTop.x, this._rightBottom.x );
    }
    get right() {
        if ( this._angleDirty ) this.updateAngle();
        return Math.max( this._leftTop.x, this._leftBottom.x, this._rightTop.x, this._rightBottom.x );
    }

    /**
     * Точки вершин прямоугольника
     */
    get leftTop() {
        if ( this._angleDirty ) this.updateAngle();
        return this._leftTop;
    }
    get leftBottom() {
        if ( this._angleDirty ) this.updateAngle();
        return this._leftBottom;
    }
    get rightTop() {
        if ( this._angleDirty ) this.updateAngle();
        return this._rightTop;
    }
    get rightBottom() {
        if ( this._angleDirty ) this.updateAngle();
        return this._rightBottom;
    }

    updateAngle() {
        const anchorX = 1 - this._anchor.x;
        const anchorY = 1 - this._anchor.y;
        this._leftTop = this.getAnglePoint( this._x, this._y );
        this._leftBottom = this.getAnglePoint( this._x, this._y + this._height * anchorY );
        this._rightTop = this.getAnglePoint( this._x + this._width * anchorX, this._y );
        this._rightBottom = this.getAnglePoint( this._x + this._width * anchorX, this._y + this._height * anchorY );
        this._angleDirty = false;
    }

    update( x, y, width, height ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * 
     * @param { Point } point 
     */
    setPivot( point ) {
        if ( !point || !point.hasOwnProperty( "x" ) || !point.hasOwnProperty( "y" ) ) return;
        this.x = point.x;
        this.y = point.y;
    }

    /**
     * Назначить размеры через точку
     * @param { Point } point 
     */
    setSize( point ) {
        if ( !point || !point.hasOwnProperty( "x" ) || !point.hasOwnProperty( "y" ) ) return;
        this.width = point.x;
        this.height = point.y;
    }

    getAnglePoint( correctionX, correctionY ) {
        const x = correctionX * Math.cos( this._angle ) - correctionY * Math.sin( this._angle );
        const y = correctionX * Math.sin( this._angle ) + correctionY * Math.cos( this._angle );
        return new Point( x, y );
    }

    toString() {
        return this._x.toString() + "," + this._y.toString() + "," + this._width.toString() + "," + this._height.toString() + ";";
    }

}