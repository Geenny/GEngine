import Module from "../../Module";
import SoundsVO from "./vo/SoundsVO";
import Resources from "../resource/Resources";
import Sound from "./Sound";
import SoundVO from "./vo/SoundVO";
import SoundEvent from "./event/SoundEvent";
import { SETTINGS_NAME } from "../../../../../../constants/NAMES";
import PlatformEvent from "../../../../platform/event/PlatformEvent";
import ObjectUtils from "../../../../../../utils/tech/ObjectUtils";

export default class Sounds extends Module {

    /**
     * Enable
     */
    static get enable() { return Sounds.instance ? Sounds.instance.enable : false; }
    static set enable( value ) {
        if ( !Sounds.instance ) return;
        Sounds.instance.enable = value;
    }

    /**
     * Mute
     */
    static get mute() { return Sounds.instance ? Sounds.instance.mute : false; }
    static set mute( value ) {
        if ( !Sounds.instance ) return;
        Sounds.instance.mute = value;
    }

    /**
     * Звук
     */
    static get volume() { return Sounds.instance ? Sounds.instance.volume : false; }
    static set volume( value ) {
        if ( !Sounds.instance ) return;
        Sounds.instance.volume = value;
    }

    /**
     * Запустить семпл на проигрывание
     * @param { String } soundName 
     * @param { Object } options 
     */
    static play( soundName, options = {} ) {
        if ( !Sounds.instance ) return;
        return Sounds.instance.play( soundName, options );
    }

    /**
     * Остановить семпл
     * @param { String } soundName 
     */
    static stop( soundName ) {
        if ( !Sounds.instance ) return;
        return Sounds.instance.stop( soundName );
    }


    /**
     * @param { SoundsVO } vo
     */
    constructor( vo = new SoundsVO() ) {
        super( vo );
    }


    //
    // GET/SET
    //
    get enable() { return this._enable === undefined ? true : this._enable; }
    set enable( value ) {
        if ( this._enable === value ) return;
        this._enable = value;
        this._muteUpdate();
        this.dispatchEvent( new SoundEvent( SoundEvent.MUTE, this ) );
    }

    get inited() { return this._inited; }
    get soundList() { return this._soundList; }

    get mute() { return this.vo.mute; }
    set mute( value ) { 
        if ( this.vo.mute === value ) return;
        this.vo.mute = value;
        this._muteUpdate();
        this.dispatchEvent( new SoundEvent( SoundEvent.MUTE, this ) );
    }

    get volume() { return this.vo.volume; }
    set volume( value ) {
        if ( typeof value === "number" || value < 0 || value > 1 ) return;
        if ( this.vo.volume === value ) return;
        this.vo.volume = value;
        this._volumeUpdate();
        this.dispatchEvent( new SoundEvent( SoundEvent.VOLUME, this ) );
    }

    //
    // INIT
    //

    init() {
        if ( this.inited ) return;
        this._inited = true;

        this._initGlobalSounds();
        this._initSoundsVars();
        this.subscribe();
    }
    _initSoundsVars() {
        this._soundList = [];
    }
    _initGlobalSounds() {
        Sounds.instance = this;
    }
    _storageDataUpdate( soundData ) {
        if ( !soundData ) return;
        this.mute = soundData.mute || this.mute;
        this.volume = soundData.volume || this.volume;
    }
    _muteUpdate() {
        for ( let i = 0; i < this.soundList.length; i++ ) {
            const sound = this.soundList[ i ];
            sound.muteGlobal = !this.enable || this.mute;
        }
    }
    _volumeUpdate() {
        for ( let i = 0; i < this.soundList.length; i++ ) {
            const sound = this.soundList[ i ];
            sound.volumeGlobal = this.volume;
        }
    }


    //
    // DESTROY
    //
    destroy() {
        ObjectUtils.destroyList( this._soundList );
        Sounds.instance = null;
    }


    //
    // LISTENERS
    //

    subscribe() {
        if ( this.subscribed ) return;
        this.subscribed = true;
    }
    unsubscribe() {
        if ( !this.subscribed ) return;
        this.subscribed = false;
    }


    //
    // PLAY
    //

    play( soundName, options = {} ) {
        const sound = this._createFromResource( soundName );
        if ( !sound ) return;
        this._playSound( sound, options );
    }

    stop( soundName ) {
        this._stopSound( soundName );
    }

    _findSounds( soundName ) {
        const list  = [];
        for ( let i = 0; i < this.soundList.length; i++ ) {
            const sound = this.soundList[ i ];
            if ( sound.name != soundName && sound.ID != soundName ) continue;
            list.push( sound );
        }
        return list;
    }

    _createFromResource( resourceName ) {
        const resource = Resources.resourceGetByName( resourceName );
        if ( !resource || !resource.content || !( resource.content instanceof Audio ) ) return null;
        const sound = this._soundCreate( resource );
        return sound;
    }

    _playSound( sound, options = {} ) {
        sound.volumeGlobal = this.volume;
        sound.muteGlobal = this.mute;
        sound.play( options );
    }

    _stopSound( soundName ) {
        const list = this._findSounds( soundName );
        for ( let i = 0; i < list.length; i++ ) {
            const sound = list[ i ];
            sound.stop();
        }
    }

    _soundCreate( resource ) {
        const audio = resource.content.cloneNode();

        const soundData = {
            ID:     resource.ID,
            name:   resource.name,
            url:    resource.url,
            audio:  audio
        };
        const soundVO = new SoundVO( soundData );
        const sound = new Sound( soundVO );
        sound.addEventListener( SoundEvent.ANY, this._onSoundEvent, this );
        this._soundToListAdd( sound );
        
        return sound;
    }

    _soundToListAdd( sound ) {
        this._soundList.push( sound );
    }

    _onSoundEvent( event ) {

        const sound = event.target;

        switch( event.type ) {
            case SoundEvent.STOP:
                const index = this._soundList.indexOf( sound );
                if ( index >= 0 ) this._soundList.splice( index, 1 );
                sound.destroy();
                break;
        }
    }

}
