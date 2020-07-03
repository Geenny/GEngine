import ModuleVO from "../../../vo/ModuleVO";

export default class ScreenManagerVO extends ModuleVO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.screenBuilderStruct = null;
        this.screenStructList = []; // Список структур скринов
        this.screenList = []; // Список доступных скринов
        this.screenCurrent = null;
        this.screenHistory = [];

        this.showDefaultScreen = true;
    }

}