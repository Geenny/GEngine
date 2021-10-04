import EventDispatcherVOWrapper from "../../../../../../data/vo/EventDispatcherVOWrapper";
import ScreenBuilderVO from "./vo/ScreenBuilderVO";
import NodeSequenceType from "./pixi/constants/NodeSequenceType";
import NodeAlignType from "./pixi/constants/NodeAlignType";
import NodeFillType from "./pixi/constants/NodeFillType";
import Point from "../../../../../../data/content/graphics/Point";
import NodeMagnetType from "./pixi/constants/NodeMagnetType";

export default class ScreenBuilder extends EventDispatcherVOWrapper {

    constructor( screenBuilderVO = new ScreenBuilderVO() ) {
        super( screenBuilderVO );
    }

    //
    // GET/SET
    //
    get application() { return this.vo.application; }

    //
    // INIT
    //
    init() { }

    /**
     * @param { Screen } screen 
     */
    build( screenData, layer = 0 ) { }

    clear( screenNode ) { }


    //
    // RESIZE
    //
    resize( screenNode, size ) {
        this._resizeContentNode( screenNode, size, size );
    }
    resizeNodeChild( screenNode, size, fullSize = null ) {
        screenNode.size = size;
        screenNode.fullSize = fullSize || size;
    }
    resizeContent( screenNode ) {
        if ( !screenNode.content ) return;
        if ( !screenNode.content.resize ) return;
        screenNode.content.resize( screenNode.size );
    }
    _resizeContentNode( screenNode, size, fullSize ) {
        this.resizeNodeChild( screenNode, size, fullSize );
        this._resizeFillUpdate( screenNode );
        this._resizeAlignUpdate( screenNode );
        this._resizeMagnetUpdate( screenNode );
        this._resizeScreenNodeChildren( screenNode );
        this._resizeContentNodePositionUpdate( screenNode );
        this.resizeContent( screenNode );
    }
    _resizeScreenNodeChildren( screenNode ) {
        if ( !screenNode.list || !screenNode.list.length ) return;

        const list = [];
        const percent = new Point();
        
        for ( let i = 0; screenNode.list && i < screenNode.list.length; i++ ) {
            const screenNodeChild = screenNode.list[ i ];
            const point = new Point( screenNodeChild.parameters.widthPercent || 1, screenNodeChild.parameters.heightPercent || 1 );
            if ( screenNode.sequence === NodeSequenceType.HORIZONTAL ) {
                percent.x = percent.x + point.x;
                percent.y = 1;
            } else if ( screenNode.sequence === NodeSequenceType.VERTICAL ) {
                percent.x = 1;
                percent.y = percent.y + point.y;
            }
            list.push( { screenNodeChild, point } );
        }

        let position = 0;
        for ( let i = 0; i < list.length; i++ ) {
            const object = list[ i ];
            const fullSize = new Point( screenNode.size.x, screenNode.size.y );
            const size = new Point( fullSize.x * object.point.x, fullSize.y * object.point.y );
            const screenNodeChild = object.screenNodeChild;
            if ( screenNode.sequence === NodeSequenceType.HORIZONTAL ) {
                size.x = screenNode.size.x * object.point.x / percent.x;
                screenNodeChild.parameters.x = position;
                position += size.x;
            } else if ( screenNode.sequence === NodeSequenceType.VERTICAL ) {
                size.y = screenNode.size.y * object.point.y / percent.y;
                screenNodeChild.parameters.y = position;
                position += size.y;
            }
            this._resizeContentNode( screenNodeChild, size, fullSize );
        }
    }
    _resizeAlignUpdate( screenNode ) {
        switch( screenNode.align ) {
            case NodeAlignType.TC:
            case NodeAlignType.CC:
            case NodeAlignType.BC:
                screenNode.parameters.x = screenNode.fullSize.x * 0.5;
                break;

            case NodeAlignType.TR:
            case NodeAlignType.CR:
            case NodeAlignType.BR:
                screenNode.parameters.x = screenNode.fullSize.x;
                break;

            case NodeAlignType.CUSTOM:
                const align = screenNode.parameters && screenNode.parameters.align ? screenNode.parameters.align.x || 0 : 0;
                screenNode.parameters.x = screenNode.fullSize.x * align;
                break;
        }

        switch( screenNode.align ) {
            case NodeAlignType.CL:
            case NodeAlignType.CC:
            case NodeAlignType.CR:
                screenNode.parameters.y = screenNode.fullSize.y * 0.5;
                break;
            
            case NodeAlignType.BL:
            case NodeAlignType.BC:
            case NodeAlignType.BR:
                screenNode.parameters.y = screenNode.fullSize.y;
                break;

            case NodeAlignType.CUSTOM:
                const align = screenNode.parameters && screenNode.parameters.align ? screenNode.parameters.align.y || 0 : 0;
                screenNode.parameters.y = screenNode.fullSize.y * align;
                break;
        }
    }
    _resizeMagnetUpdate( screenNode ) {
        switch( screenNode.magnet ) {
            case NodeMagnetType.TC:
            case NodeMagnetType.CC:
            case NodeMagnetType.BC:
                screenNode.parameters.x = screenNode.fullSize.x * 0.5 - screenNode.size.x * 0.5;
                break;

            case NodeMagnetType.TR:
            case NodeMagnetType.CR:
            case NodeMagnetType.BR:
                screenNode.parameters.x = screenNode.fullSize.x - screenNode.size.x;
                break;
        }

        switch( screenNode.magnet ) {
            case NodeMagnetType.CL:
            case NodeMagnetType.CC:
            case NodeMagnetType.CR:
                screenNode.parameters.y = screenNode.fullSize.y * 0.5 - screenNode.size.y * 0.5;
                break;
            
            case NodeMagnetType.BL:
            case NodeMagnetType.BC:
            case NodeMagnetType.BR:
                screenNode.parameters.y = screenNode.fullSize.y - screenNode.size.y;
                break;
        }
    }
    _resizeFillUpdate( screenNode ) {
        switch( screenNode.fill ) {
            case NodeFillType.LANDSCAPE:
                screenNode.size.x = screenNode.fullSize.x;
                break;
            case NodeFillType.PORTRAIT:
                screenNode.size.y = screenNode.fullSize.y;
                break;
            case NodeFillType.FULL:
                screenNode.size.x = screenNode.fullSize.x;
                screenNode.size.y = screenNode.fullSize.y;
                break;

            case NodeFillType.LANDSCAPE_LOCK_RESOLUTION:
                screenNode.size.x = screenNode.fullSize.x;
                screenNode.size.y = screenNode.parameters.height * screenNode.size.x / screenNode.parameters.width;
                break;
            case NodeFillType.PORTRAIT_LOCK_RESOLUTION:
                screenNode.size.y = screenNode.fullSize.y;
                screenNode.size.x = screenNode.parameters.width * screenNode.size.y / screenNode.parameters.height;
                break;
            case NodeFillType.FULL_LOCK_RESOLUTION:
                screenNode.size.x = screenNode.fullSize.x;
                screenNode.size.y = screenNode.parameters.height * screenNode.size.x / screenNode.parameters.width;
                if ( screenNode.size.y > screenNode.fullSize.y ) {
                    screenNode.size.y = screenNode.fullSize.y;
                    screenNode.size.x = screenNode.parameters.width * screenNode.size.y / screenNode.parameters.height;
                }
                break;

            case NodeFillType.LANDSCAPE_IN_LOCK_RESOLUTION:
                screenNode.size.x = screenNode.fullSize.x;
                screenNode.size.y = screenNode.parameters.height * screenNode.size.x / screenNode.parameters.width;
                break;
            case NodeFillType.PORTRAIT_IN_LOCK_RESOLUTION:
                screenNode.size.y = screenNode.fullSize.y;
                screenNode.size.x = screenNode.parameters.width * screenNode.size.y / screenNode.parameters.height;
                break;
            case NodeFillType.FULL_IN_LOCK_RESOLUTION:
                if ( screenNode.size.x < screenNode.fullSize.x ) {
                    screenNode.size.x = screenNode.fullSize.x;
                    screenNode.size.y = screenNode.parameters.height * screenNode.size.x / screenNode.parameters.width;
                } else if ( screenNode.size.y < screenNode.fullSize.y ) {
                    screenNode.size.y = screenNode.fullSize.y;
                    screenNode.size.x = screenNode.parameters.width * screenNode.size.y / screenNode.parameters.height;
                }
                break;
        }
    }

    _resizeContentNodePositionUpdate( screenNode ) { }

}