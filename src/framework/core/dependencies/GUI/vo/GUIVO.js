import DependencyVO from "../../../machines/dependency/vo/DependencyVO";

export default class ViewsVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    init() {
        super.init();
        this.displayStructList = [];
    }

}