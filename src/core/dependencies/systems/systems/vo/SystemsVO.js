import DependencyVO from "../../../../machines/dependency/vo/DependencyVO";

export default class SystemsVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    init() {
        
        super.init();

        this.name = null;
        this.systems = [];
        this.systemsStartList = [];

    }

}