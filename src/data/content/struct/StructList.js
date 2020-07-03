import ArrayUtils from "../../../utils/tech/ArrayUtils";

export default class StructList {

    /**
     * 
     * @param { Array<Struct> } list 
     */
    constructor( list = [] ) {
        this.list = ArrayUtils.clone( list );
        this.create();
    }

    create() {
        
    }


}