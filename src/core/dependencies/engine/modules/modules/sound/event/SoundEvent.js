import Event from "../../../../../../machines/event/Event";

export default class SoundEvent extends Event {

    /**
     * @param { String } type 
     * @param { Sound } screenStruct 
     */
    constructor( type, sound ) {
        super( type );
        this.sound = sound;
    }
    
}

SoundEvent.CREATE = "soundCreate";
SoundEvent.PLAY = "soundPlay";
SoundEvent.PAUSE = "soundPause";
SoundEvent.UNPAUSE = "soundUnpause";
SoundEvent.STOP = "soundStop";
SoundEvent.SETTINGS = "soundSettings";
SoundEvent.MUTE = "soundMute";
SoundEvent.VOLUME = "soundVolume";