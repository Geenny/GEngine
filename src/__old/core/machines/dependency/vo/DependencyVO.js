import VO from "../../../../data/vo/VO";

export default class DependencyVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.ID = 0;
        this.name = null;
        this.dependenceNameList = [];
        this.application = null;
    }

}