import { CanvasTexture } from "three";

export default class ResourceGenerator {

    static colorToString( color ) { return "#" + color.toString( 16 ); }

    static getTexture( size = 256, color = 0xff0000 ) {
        const canvas = document.createElement( "canvas" );
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext( "2d" );
        // var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        // gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
        // gradient.addColorStop( 1, 'rgba(255,255,255,1)' );
        // context.fillStyle = gradient;
        
        context.fillStyle = ResourceGenerator.colorToString( color );
        context.fillRect( 0, 0, canvas.width, canvas.height );

        return new CanvasTexture( canvas );
    }

    static getText( text = "" ) {
        const canvas = document.createElement( "canvas" );

        canvas.width = 512;
        canvas.height = 128;

        const context = canvas.getContext( "2d" );
        context.font = "26px Arial";

        var g = context.createLinearGradient( 0, 0, canvas.width, 0 );
        g.addColorStop("0","magenta");
        g.addColorStop("0.3","blue");
        g.addColorStop("1.0","red");

        context.fillStyle = g; // ResourceGenerator.colorToString( 0xff0000 );
        const measureText = context.measureText( text );
        context.fillText( text, 0, 20 );
        context.fillText( text, 0, 40 );
        context.fillText( text, 0, 60 );

        return new CanvasTexture( canvas );
    }

}