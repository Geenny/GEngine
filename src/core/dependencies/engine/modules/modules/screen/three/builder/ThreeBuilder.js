import { Group } from "three";
import NodeType from "../../constants/NodeType";
import ScreenBuilder from "../../ScreenBuilder";
import ThreeNodeType from "../../three/constants/ThreeNodeType";
import PlaneWrapper from "../nodes/PlaneWrapper";

export default class ThreeBuilder extends ScreenBuilder {

    constructor( threeBuilderVO ) {
        super( threeBuilderVO );
    }


    //
    // GET/SET
    //
    get view() { return this.application && this.application.modules && this.application.modules.view ? this.application.modules.view : null; }

    get scene() { return this.view && this.view.scene ? this.view.scene : null; }
    get uiscene() { return this.view && this.view.uiscene ? this.view.uiscene : null; }


    //
    // INIT
    //
    init() {
        super.init();
    }


    //
    // RESIZE
    //
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
        if ( this.scene && screenNode.content ) {
            screenNode.content.zIndex = layer;
            this.scene.add( screenNode.content );

            // var geometry = new PlaneGeometry( 10, 50, 32 );
            // var material = new MeshBasicMaterial( { color: 0xffff00, side: DoubleSide } );
            // var plane = new Mesh( geometry, material );
            // debugger;

            // this.scene.add( plane );
        }
        return screenNode;
    }
    clear( screenNode ) {
        if ( !screenNode ) return;
        // debugger;
        if ( this.scene ) this.scene.remove( screenNode.content );
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
            debugger;
            const childNodeData = list[ i ];
            const childNode = this._screenNodeCreate( childNodeData );
            screenNode.content.add( childNode.content );
            screenNode.list.push( childNode );
        }
    }
    _screenNodeParametersUpdate( screenNode ) {
        if ( !screenNode.parameters ) return;
        if ( typeof screenNode.parameters.x === "number" ) {
            screenNode.content.x = screenNode.parameters.x;
        }
        if ( typeof screenNode.parameters.y === "number" ) {
            screenNode.content.y = screenNode.parameters.y;
        }
        if ( typeof screenNode.parameters.z === "number" ) {
            screenNode.content.z = screenNode.parameters.z;
        }
    }
    _screenNodeByTypeCreate( nodeData ) {
        let content = null;

        switch( nodeData.type ) {

            // Контейнер
            case NodeType.NODE:
            case ThreeNodeType.GROUP:
                content = new Group();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;

            case ThreeNodeType.PLANE:
                content = new PlaneWrapper();
                content.size = nodeData.size;
                content.parameters = nodeData.nodeParameters;
                break;

            case ThreeNodeType.TEXT:
                break;

            default:
                debugger;
            
        }

        const screenNode = { ...nodeData, content, list: [] };

        if ( content ) {
            content.node = screenNode;
        }

        return screenNode;
    }

}