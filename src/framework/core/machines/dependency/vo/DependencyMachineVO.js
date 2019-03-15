import VO from "../../../../data/vo/VO";

export default class DependencyMachineVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.dependencyStructList = [];
    }

}