import { Text, Graphics } from "pixi.js";
import Step from "../machines/step/Step";
import ApplicationEvent from "../application/event/ApplicationEvent";
import ScreenName from "../screens/ScreenName";
import ResourcesEvent from "../dependencies/engine/modules/modules/resource/event/ResourcesEvent";

export default class LogoStep extends Step {

    onStart() {
        const screen = this.screenManager.screenShowByID( ScreenName.LOADING );
        this.screenNode = screen.nodeByNameGet( "TextContainer" );
        this.mainContainer = this.screenNode.content;
        this.subscribe();
    }

    onStop() {
        this._progressBarRemove();
        this.unsubscribe();
    }

    startTest() {
        const audio = new Audio( "/assets/sounds/test.mp3" );
        audio.volume = 0;
        const promise = audio.play();
        promise
            .then( () => {
                this.stop();
            } )
            .catch( () => {
                this._textAdd();
            } );
    }


    //
    // SUBSCRIBE
    //
    subscribe() {
        this.application.addEventListener( ResourcesEvent.PROGRESS, this.onProgressEvent, this );
        this.application.addEventListener( ResourcesEvent.READY, this.onReadyEvent, this );
        this.application.addEventListener( ApplicationEvent.INTERACTION, this.onInteractionEvent, this );
    }
    unsubscribe() {
        this.application.removeEventListener( ResourcesEvent.PROGRESS, this.onProgressEvent, this );
        this.application.removeEventListener( ResourcesEvent.READY, this.onReadyEvent, this );
        this.application.removeEventListener( ApplicationEvent.INTERACTION, this.onInteractionEvent );
    }

    onProgressEvent( event ) {
        const progress = event.data && event.data.progress ? event.data.progress : 0;
        this._progressBarUpdate( progress );
    }
    onReadyEvent( event ) {
        this._progressBarRemove();
        this.startTest();
    }
    onInteractionEvent( event ) {
        if ( !this.application.resourceReady ) return;
        this.stop();
    }



    _textAdd() {
        if ( this.textField ) return;
        this.textField = new Text( "Press to continue", { fill: 0x999999 } );
        this.textField.anchor.set( 0.5 );
        this.textField.y = -100;
        this.mainContainer.addChild( this.textField );
    }
    _progressBarUpdate( progress ) {
        if ( !this.progressBar ) {
            this._progressBarAdd();
        }
        this.progressBar.clear();
        this.progressBar.beginFill( 0x999999, 1 );
        this.progressBar.drawRect( -150, -40, 300 * progress, 2 );
    }
    _progressBarAdd() {
        if ( this.progressBar ) return;
        this.progressBar = new Graphics();
        this.mainContainer.addChild( this.progressBar );
    }
    _progressBarRemove() {
        if ( !this.progressBar ) return;
        this.mainContainer.removeChild( this.progressBar );
        this.progressBar = null;
    }

    // onStart() {
    //     this.logoScreenShow();
    //     this.logoTimeoutStart();
    // }

    // logoScreenShow() {
    //     if ( !this.application || !this.application.screenManager ) return;
    //     this.screen = this.application.screenManager.screenShowByID( ScreenName.LOGO );
    // }

    // logoTimeoutStart() {
    //     if ( this.timeout ) return;
    //     this.timeout = setTimeout( () => {
    //         this.stop();
    //     }, 3000 );
    // }

    // onStop() {
    //     if ( this.timeout ) clearTimeout( this.timeout );

    //     Sounds.play( "ThemeMusic", { start: 1, volume: 0.5, loop: true } );
    // }

}