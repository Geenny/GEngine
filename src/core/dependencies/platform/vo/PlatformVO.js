import DependencyVO from "../../../machines/dependency/vo/DependencyVO";

export default class PlatformVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        super.initVars();

        this.platformVOData = {
            onInit: null,
            onStart: null,
            onReady: null,
            onError: null
        };

        this.platformName = null;
        this.platformVersion = null;
        this.platformLocale = null;

        this.playerID = null;
        this.playerAvatar = null;
        this.playerName = null;
        this.playerNik = null;
        this.playerEmail = null;
        this.playerPhone = null;
        this.playerEmails = [];
        this.playerPhones = [];

        this.platformFriends = [];

        this.history = [];

        this.onInit = null;
        this.onStart = null;
        this.onReady = null;
        this.onError = null;
    }

}