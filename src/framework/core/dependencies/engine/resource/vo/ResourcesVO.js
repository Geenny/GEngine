import VO from "../../../../../data/vo/VO";

export default class ResourcesVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.resourceDataList = [];
    }

}