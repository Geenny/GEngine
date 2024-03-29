import ScreenBuilder from "../../ScreenBuilder";
import ContainerWrapper from "../nodes/ContainerWrapper";
import NodeType from "../../constants/NodeType";
import PixiNodeType from "../constants/PixiNodeType";
import { Sprite } from "pixi.js";
import SpriteWrapper from "../nodes/SpriteWrapper";
import GraphicsWrapper from "../nodes/GraphicsWrapper";
import SpriteBound from "../nodes/SpriteBound";
import ButtonWrapper from "../nodes/ButtonWrapper";

export default class PixiBuilder extends ScreenBuilder {

    constructor( pixiBuilderVO ) {
        super( pixiBuilderVO );
    }


    //
    // GET/SET
    //
    get container() { return this.application && this.application.modules && this.application.modules.view && this.application.modules.view.stage ?
        this.application.modules.view.stage : null; }


    //
    // INIT
    //
    init() {
        super.init();
    }


    //
    // RESIZE
    //
    // resizeNodeChild( screenNode, size, fullSize ) {
    //     super.resizeNodeChild( screenNode, size, fullSize );
    // }
    _resizeContentNodePositionUpdate( screenNode ) {
        if ( !screenNode.content ) return;
        if ( screenNode.parameters.hasOwnProperty( "x" ) ) screenNode.content.x = screenNode.parameters.x || 0;
        if ( screenNode.parameters.hasOwnProperty( "y" ) ) screenNode.content.y = screenNode.parameters.y || 0;
    }


    //
    // BUILD
    //
    build( screenData, layer = 0 ) {
        const screenNode = this._screenNodeCreate( screenData );
        if ( this.container && screenNode.content ) {
            screenNode.content.zIndex = layer;
            this.container.addChild( screenNode.content );
        }
        return screenNode;
    }
    clear( screenNode ) {
        if ( !screenNode ) return;
        screenNode.content.removeChildren();
        if ( this.container ) this.container.removeChild( screenNode.content );
        screenNode.content = null;
    }

    _screenNodeCreate( nodeData ) {
        const screenNode = this._screenNodeByTypeCreate( nodeData );
        this._screenNodeParametersUpdate( screenNode );
        this._screenNodeChildrenCreate( screenNode, nodeData.list );
        return screenNode;
    }
    _screenNodeChildrenCreate( screenNode, list ) {
        if ( !list ) return;
        for ( let i = 0; i < list.length; i++ ) {
            const childNodeData = list[ i ];
            const childNode = this._screenNodeCreate( childNodeData );
            screenNode.content.addChild( childNode.content );
            screenNode.list.push( childNode );
        }
    }
    _screenNodeParametersUpdate( screenNode ) {
        if ( !screenNode.parameters ) return;
        if ( typeof screenNode.parameters.x === "number" ) {
            screenNode.content.position.x = screenNode.parameters.x;
        }
        if ( typeof screenNode.parameters.y === "number" ) {
            screenNode.content.position.y = screenNode.parameters.y;
        }
        if ( screenNode.parameters.position ) {
            if ( screenNode.parameters.position.hasOwnProperty( "x" ) ) {
                screenNode.content.position.x = screenNode.parameters.position.x;
            }
            if ( screenNode.parameters.position.hasOwnProperty( "y" ) ) {
                screenNode.content.position.y = screenNode.parameters.position.y;
            }
        }
        if ( screenNode.parameters.scale ) {
            if ( typeof screenNode.parameters.scale === "number" ) {
                screenNode.content.scale.set( screenNode.parameters.scale );
            }
            if ( screenNode.parameters.scale.hasOwnProperty( "x" ) ) {
                screenNode.content.scale.x = screenNode.parameters.scale.x;
            }
            if ( screenNode.parameters.scale.hasOwnProperty( "y" ) ) {
                screenNode.content.scale.y = screenNode.parameters.scale.y;
            }
        }
        if ( screenNode.content instanceof Sprite ) {
            if ( screenNode.parameters.anchor ) {
                if ( typeof screenNode.parameters.anchor === "number" ) {
                    screenNode.content.anchor.set( screenNode.parameters.anchor );
                }
                if ( screenNode.parameters.anchor.hasOwnProperty( "x" ) ) {
                    screenNode.content.anchor.x = screenNode.parameters.anchor.x;
                }
                if ( screenNode.parameters.anchor.hasOwnProperty( "y" ) ) {
                    screenNode.content.anchor.y = screenNode.parameters.anchor.y;
                }
            }
        }
    }
    _screenNodeByTypeCreate( nodeData ) {
        let content = null;

        switch( nodeData.type ) {

            // CUSTOM
            case PixiNodeType.CUSTOM:
                const CustomClass = nodeData.class;
                content = new CustomClass();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;

            // CUSTOM
            case PixiNodeType.BUTTON:
                content = new ButtonWrapper( nodeData.nodeParameters );
                content.size = nodeData.size;
                content.interactive = true;
                // content.parameters = nodeData.nodeParameters;
                break;

            // Контейнер
            case NodeType.NODE:
            case PixiNodeType.CONTAINER:
                content = new ContainerWrapper();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;

            // Image
            case PixiNodeType.IMAGE:
                content = new SpriteWrapper();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;

            // Image
            case PixiNodeType.IMAGE_BOUND:
                content = new SpriteBound();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;

            // Graphics
            case PixiNodeType.GRAPHICS:
                content = new GraphicsWrapper();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;
        }

        const screenNode = { ...nodeData, content, list: [] };

        if ( content ) {
            content.node = screenNode;
        }

        return screenNode;
    }

}