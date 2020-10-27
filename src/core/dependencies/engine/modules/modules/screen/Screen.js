import EventDispatcherVOWrapper from "../../../../../../data/vo/EventDispatcherVOWrapper";
import ScreenVO from "./vo/ScreenVO";
import ScreenEvent from "./event/ScreenEvent";
import Rectangle from "../../../../../../data/content/graphics/Rectangle";
import Point from "../../../../../../data/content/graphics/Point";

export default class Screen extends EventDispatcherVOWrapper {

    /**
     * 
     * @param { ScreenVO } screenVO
     */
    constructor( screenVO = new ScreenVO() ) {
        super( screenVO );
    }


    //
    // GET/SET
    //
    get active() { return this._active; }
    get debug() { return this.screenManager.debug; }

    get ID() { return this.vo.ID; }
    get name() { return this.vo.name; }
    get layer() { return this.vo.layer || 0; }
    get popup() { return this.vo.screenPopup; }
    get isDefault() { return this.vo.screenDefault; }

    get screenManager() { return this.vo.screenManager; }
    get screenBuilder() { return this.screenManager.screenBuilder; }
    get screenData() { return this.vo.screenData; }
    get screenNode() { return this._screenNode; }
    get screenNodeAsList() { return this._screenNodeAsList; }
    get content() { return this._screenNode && this.screenNode.content ? this.screenNode.content : null; }


    //
    // INIT
    //
    init() {
        this.initVars();
        this.initScreenData();
        this.dispatchEvent( new ScreenEvent( ScreenEvent.INIT, this ) );
    }
    initVars() {
        this._active = false;
        this._screenNode = null;
        this._screenNodeAsList = [];
        this._debugBoundsList = [];
    }
    initScreenData() {
        this._screenDataPrepare( this.screenData );
    }
    _screenDataPrepare( screenData ) {
        if ( !screenData ) return;
        this._screenDataParametersConvert( screenData );
        if ( !screenData.list ) return;
        for ( let i = 0; i < screenData.list.length; i++ ) {
            const nodeScreenData = screenData.list[ i ];
            this._screenDataPrepare( nodeScreenData );
        }
    }
    _screenDataParametersConvert( screenData ) {
        if ( !screenData.parameters ) screenData.parameters = { };
        if ( !screenData.parameters.widthPercent ) screenData.parameters.widthPercent = 1;
        if ( !screenData.parameters.heightPercent ) screenData.parameters.heightPercent = 1;

        // width
        if ( typeof screenData.parameters.width === "string" ) {
            const widthPercentSignIndex = screenData.parameters.width.indexOf( "%" );
            if ( widthPercentSignIndex > 0 ) {
                const widthPercent = screenData.parameters.width.substring( 0, widthPercentSignIndex );
                screenData.parameters.widthPercent = parseInt( widthPercent ) / 100;
            }
        }

        // height
        if ( typeof screenData.parameters.height === "string" ) {
            const heightPercentSignIndex = screenData.parameters.height.indexOf( "%" );
            if ( heightPercentSignIndex > 0 ) {
                const heightPercent = screenData.parameters.height.substring( 0, heightPercentSignIndex );
                screenData.parameters.heightPercent = parseInt( heightPercent ) / 100;
            }
        }
    }


    //
    // DESTROY
    //
    destroy() {
        this.hide();
    }


    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
        this.resizeContent();
        this.debugRedraw();
    }
    resizeContent() {
        if ( !this._screenNode || !this.size ) return;
        this.screenBuilder.resize( this._screenNode, this.size );
        this.debugRedraw();
    }
    


    //
    // SHOW
    //
    show() {
        this.dispatchEvent( new ScreenEvent( ScreenEvent.SHOW_START, this ) );
        this.draw();
        this.showComplete();
    }
    showComplete() {
        this._active = true;
        this.dispatchEvent( new ScreenEvent( ScreenEvent.SHOW, this ) );
    }

    hide() {
        this.dispatchEvent( new ScreenEvent( ScreenEvent.HIDE_START, this ) );
        this.clear();
        this.hideComplete();
    }
    hideComplete() {
        this._active = false;
        this.dispatchEvent( new ScreenEvent( ScreenEvent.HIDE, this ) );
    }


    //
    // NODE
    //
    nodeByNameGet( nodeName ) {
        for ( let i = 0; i < this._screenNodeAsList.length; i++ ) {
            const screenNode = this._screenNodeAsList[ i ];
            if ( screenNode.name != nodeName ) continue;
            return screenNode;
        }
        return null;
    }


    //
    // DRAW
    //
    draw() {
        if ( this.active ) return;
        this._active = true;
        this._screenNode = this.screenBuilder.build( this.screenData, this.layer );
        this._screenNodeAsList = this._screenNodeAsListGet( this._screenNode );
        this.debugBoundsAdd();
        this.resizeContent();
    }
    clear() {
        if ( !this.active ) return;
        this._active = false;
        this.screenBuilder.clear( this._screenNode );
    }

    _screenNodeAsListGet( screenNode, list ) {
        if ( !list ) list = [];
        list.push( screenNode );
        if ( screenNode.list ) {
            for ( let i = 0; i < screenNode.list.length; i++ ) {
                const childScreenNode = screenNode.list[ i ];
                this._screenNodeAsListGet( childScreenNode, list );
            } 
        }
        return list;
    }




    //
    // DEBUG
    //
    debugBoundsAdd() {
        if ( !this.debug ) return;
        if ( !this._screenNode ) return;
        this.debugBoundsNodeAdd( this._screenNode );
    }
    debugBoundsRemove() {
        while ( this._debugBoundsList.length ) {
            const screenNode = this._debugBoundsList.shift();
            this.debugBoundsNodeRemove( screenNode );
        }
    }
    debugRedraw() {
        for ( let i = 0; i < this._debugBoundsList.length; i++ ) {
            const screenNodeChild = this._debugBoundsList[ i ];
            this.debugRedrawNode( screenNodeChild );
        }
    }
    debugRedrawNode( screenNode ) {
        const rectengle = new Rectangle( 0, 0, Math.floor( screenNode.size.x ) + 0.5, Math.floor( screenNode.size.y ) + 0.5 );
        screenNode.debugRectangle = rectengle;
    }

    debugBoundsNodeAdd( screenNode ) {
        for ( let i = 0; screenNode.list && i < screenNode.list.length; i++ ) {
            const screenNodeChild = screenNode.list[ i ];
            this.debugBoundsNodeAdd( screenNodeChild );
        }
        this.debugBoundNodeCreate( screenNode );
    }
    debugBoundsNodeRemove( screenNode ) { }
    debugBoundNodeCreate( screenNode ) { }

}