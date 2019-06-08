import VO from "../../../../data/vo/VO";
import NetworkHTTPMethod from "../constants/NetworkHTTPMethod";
import HTTPLoader from "../loaders/HTTPLoader";
import NetworkLoaderType from "../constants/NetworkLoaderType";


export default class NetVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.application = null;
        this.serverList = [ {
            servers: [ 'google.com' ],
            maximumTimeout: -1,
            requestTries: 1,
            requestQueueCount: 5,
            method: NetworkHTTPMethod.GET,
            type: NetworkLoaderType.HTTP,
            requiredParameters: [],
            requiredHeaders: [],
        } ];
    }

}