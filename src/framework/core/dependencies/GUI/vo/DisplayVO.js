import DependencyVO from "../../../machines/dependency/vo/DependencyVO";

export default class DisplayVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    init() {
        super.init();
        this.viewStructList = [];
    }

}