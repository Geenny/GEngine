import EventDispatcherVOWrapper from "../../../../../../data/vo/EventDispatcherVOWrapper";
import SoundVO from "./vo/SoundVO";
import { Tween } from "@createjs/tweenjs";
import SoundEvent from "./event/SoundEvent";

export default class Sound extends EventDispatcherVOWrapper {

    /**
     * @param { SoundsVO } vo
     */
    constructor( vo = new SoundVO() ) {
        super( vo );
        this.init();
        this.dispatchEvent( new SoundEvent( SoundEvent.CREATE, this ) );
    }


    //
    // GET/SET
    //

    get ID() { return this.vo.ID; }
    get name() { return this.vo.name; }
    get url() { return this.vo.url; }

    get played() { return this._played; }
    get multi() { return this.vo.multi; }
    get audio() { return this.vo.audio; }
    get duration() { return this.audio.duration; }

    get currentTime() { return this.audio.currentTime; }
    set currentTime( value ) {
        if ( value < 0 || value > this.duration ) return;
        this.audio.currentTime = value;
    }

    get volume() {
        return ( this.muteGlobal || this.mute ) ? 0 : this.vo.volume * this._g_volume;
    }
    set volume( value ) {
        this.vo.volume = value;
        this._volumeUpdate();
    }

    get volumeGlobal() { return this._g_volume; }
    set volumeGlobal( value ) {
        this._g_volume = value;
        this._volumeUpdate();
    }

    get mute() { return this.vo.mute; }
    set mute( value ) {
        this.vo.mute = value || false;
        this._volumeUpdate();
    }

    get muteGlobal() { return this._g_mute; }
    set muteGlobal( value ) {
        this._g_mute = value;
        this._volumeUpdate();
    }
    
    get loop() { return this.vo.loop; }
    set loop( value ) {
        this.vo.loop = value || false;
        this._loopUpdate();
    }

    get start() { return this.vo.start || 0.1; }



    //
    // INIT
    //

    init() {
        this._initVars();
        this._initAudio();
    }
    _initVars() {
        this._volume = 1;
        this._loop = false;
        this._start = 0.1;
        this._g_volume = 1;
        this._g_mute = false;
    }
    _initAudio() {
        if ( !this.audio ) return;
        this.onEnd = this.onEnd.bind( this );
        this.audio.addEventListener( 'ended', this.onEnd, false );
    }
    _volumeUpdate() {
        this.audio.volume = this.volume;
    }
    _loopUpdate() {
        this.audio.loop = this.loop;
    }

    _volumeAuto( from = 0, to = this.volume, time = 0.3 ) {
        if ( time <= 0 ) return;
        if ( !this.resource || !this.audio ) return;

        this.volume = from;
        Tween.removeTweens( this.audio );
        Tween.get( this.audio ).to( { volume: to }, time );
    }


    //
    // 
    //

    play( options = {} ) {
        if ( this.played ) {
            if ( !this.multi ) return;
            this.stop();
        }
        this._played = true;

        if ( !this.audio ) return;
        if ( options.currentTime ) this.currentTime = options.currentTime;
        if ( options.volume ) this.volume = options.volume;
        if ( options.start ) this.vo.start = options.start;
        this.loop = options.loop ? options.loop : this.loop;

        this._volumeAuto( 0, this.volume, this.start );
        this._play();
        
        this.dispatchEvent( new SoundEvent( SoundEvent.PLAY, this ) );
    }

    stop() {
        this._played = false;
        this._pause();
        this.currentTime = 0;
        this.dispatchEvent( new SoundEvent( SoundEvent.STOP, this ) );
    }

    pause() {
        if ( this.played ) {
            this._played = false;
            this._pause();
            this.dispatchEvent( new SoundEvent( SoundEvent.PAUSE, this ) );
        } else {
            this._played = true;
            this._play();
            this.dispatchEvent( new SoundEvent( SoundEvent.UNPAUSE, this ) );
        }
    }

    _play() {
        const promise = this.audio.play();
        promise.then(() => {
            if ( !this.audio.paused ) return;
            this.audio.play();
        }).catch(() => { });
    }
    _pause() {
        this.audio.pause();
    }

    
    //
    //  LISTENERS
    //

    onEnd( event ) {
        this.stop();
    }


    //
    // DESTROY
    //

    destroy() {
        if ( !this.audio ) return;
        this.audio.removeEventListener( 'ended', this.onEnd );
        if ( this.played ) this.stop();
        this.vo.audio = null;
    }

}
