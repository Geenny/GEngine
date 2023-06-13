export default class StringUtils {

    /**
     * Вернуть массив строк из неразрывной строки
     * @param { CanvasRenderingContext2D } context 
     * @param { string } text 
     * @param { number } width 
     * @return { string[] }
     */
    // static wordWrapLines( context: CanvasRenderingContext2D, text: string, width: number = 0 ): string[] {
    //     let lines: string[] = [];

    //     if ( ( context instanceof CanvasRenderingContext2D ) && width > 0 ) {
    //         let words = text.split(" "), line = "";

    //         for (let i = 0; i < words.length; i++) {
    //             let word = words[i];
    //             let futureWord = (line.length > 0 ? " " : "") + word;
    //             let measure = context.measureText( line + futureWord );

    //             if ( measure.width < width ) {
    //                 line += futureWord;
    //             } else {
    //                 if ( !line ) {
    //                     let letters = "";
    //                     for ( let j = 0; j < word.length; j++ ) {
    //                         let measure2 = context.measureText( letters + word[j] );
    //                         if ( measure2.width < width ) {
    //                             letters += word[j];
    //                         } else {
    //                             lines.push( letters );
    //                             letters = "";
    //                             j--;
    //                         }
    //                     }
    //                     if ( letters ) lines.push( letters );
    //                 } else {
    //                     lines.push( line );
    //                     line = "";
    //                     i--;
    //                 }
    //             }
    //         }

    //         if ( line ) lines.push( line );
    //     } else {
    //         lines = text.split( "\n" );
    //     }

    //     return lines;
    // }

}