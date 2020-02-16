import VO from "../../../../data/vo/VO";

export default class TickerMachineVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.interval = null;           // @State
        this.fps = 60;                  // Текущий фрэймрейт
        this.startOnCreate = true;
    }

}