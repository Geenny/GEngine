import { CanvasTexture } from "three";

export default class ResourceGenerator {

    static colorToString( color ) { return "#" + color.toString( 16 ); }

    static getTexture( size = 256, color = 0xff0000 ) {
        let canvas = document.createElement( "canvas" );
        canvas.width = size;
        canvas.height = size;

        let context = canvas.getContext( "2d" );
        // var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        // gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
        // gradient.addColorStop( 1, 'rgba(255,255,255,1)' );
        // context.fillStyle = gradient;
        
        context.fillStyle = ResourceGenerator.colorToString( color );
        context.fillRect( 0, 0, canvas.width, canvas.height );

        return new CanvasTexture( canvas );
    }

}