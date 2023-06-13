import VO from "../../../../../../../data/vo/VO";
import Struct from "../../../../../../../data/content/struct/Struct";
import Resource from "../resources/Resource";

export default class ResourcesVO extends VO {

    constructor( data ) {
        super( data );
    }

    initVars() {
        this.ResourceClass = Resource;
        this.resourceDataList = [];
    }

}