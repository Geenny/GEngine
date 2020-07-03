import DependencyVO from "../../../../machines/dependency/vo/DependencyVO";

export default class EngineVO extends DependencyVO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.resourceVOData = {};
        this.modulesVOData = {};
    }

}