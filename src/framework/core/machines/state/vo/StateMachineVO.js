import VO from "../../../../data/vo/VO";

export default class StateMachineVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.chained = false;           // @State 
        this.interpolate = false;       
        this.states = null;             // Список объектов из StateEnum
        this.map = null;                // { stateName1: [ stateName2, stateName3 ] }
    }

}