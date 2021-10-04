import Screen from "../../Screen";
import { Graphics, Container } from "pixi.js";

export default class PixiScreen extends Screen {

    constructor( screenVO ) {
        super( screenVO );
    }


    //
    // DEBUG
    //
    debugRedrawNode( screenNode ) {
        super.debugRedrawNode( screenNode );

        const rectangle = screenNode.debugRectangle;
        const graphics = screenNode.debugContent;

        if ( !screenNode.color ) screenNode.color = Math.floor( 0xff0000 * Math.random() );

        graphics.clear();
        graphics.lineStyle( 1, screenNode.color, 1 );
        graphics.moveTo( rectangle.x + 2, rectangle.y + 2 );
        graphics.lineTo( rectangle.width - 4, rectangle.y + 2 );
        graphics.lineTo( rectangle.width - 4, rectangle.height - 4 );
        graphics.lineTo( rectangle.x + 2, rectangle.height - 4 );
        graphics.lineTo( rectangle.x + 2, rectangle.y + 2 );
    }
    debugBoundNodeCreate( screenNode ) {
        if ( !screenNode ) return;
        const debugContent = new Graphics();
        screenNode.debugContent = debugContent;
        this._debugBoundsList.push( screenNode );
        if ( !screenNode.content || !(screenNode.content instanceof Container) ) return;
        screenNode.content.addChild( debugContent );
    }
    debugBoundsNodeRemove( screenNode ) {
        if ( !screenNode || !screenNode.content ) return;
        screenNode.content.removeChild( screenNode.debugContent );
    }

}