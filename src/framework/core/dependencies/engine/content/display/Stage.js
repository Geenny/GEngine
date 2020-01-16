import DisplayObjectContainer from "./DisplayObjectContainer";
import DisplayObject from "./DisplayObject";

export default class Stage extends DisplayObjectContainer {

    /**
     * 
     * @param { StageVO } stageVO
     */
    constructor( stageVO ) {
        super( stageVO );
    }

    //
    // GET/SET
    //

    get scene() { return this._scene; }
    set scene( value ) { this._scene = value; }

    get camera() { return this._camera; }
    set camera( value ) { this._camera = value; }

    //
    // INIT
    //

    init() {
        super.init();
        this._initVars();
    }

    _initVars() {
        this._scene = this.vo.scene;
        this._camera = this.vo.camera;
        this._width = 0;
        this._height = 0;
        this._stage = this;
        this._globalList = [];
    }
    
    addChild( child ) {
        if ( child instanceof Stage ) {
            debugger;
            return null;
        }
        return super.addChild( child );
    }

    addToDisplay( child ) {
        this._globalList.push( child );
    }
    removeFromDisplay( child ) {
        const index = this._globalList.indexOf( child );
        this._globalList.splice( index, 1 );
    }

}