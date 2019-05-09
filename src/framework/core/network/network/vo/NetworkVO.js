import VO from "../../../../data/vo/VO";
import NetworkMethod from "../NetworkMethod";


export default class NetworkVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.application = null;
        this.serverList = [ 'google.com' ];
        this.serverIndex = 0;
        this.maximumTimeout = -1;
        this.requestTries = 1;
        this.requestMethod = NetworkMethod.POST;
        this.requestQueryCount = 5;
        
        this.requiredParameters = []; // Необходимые параметры для отправки
    }

}