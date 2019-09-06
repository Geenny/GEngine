import VO from "../../../../../data/vo/VO"
import NetworkHTTPMethod from "../constants/NetworkHTTPMethod";
import NetworkLoaderType from "../constants/NetworkLoaderType";


export default class NetVO extends VO {

    constructor( data ) {
        super( data );
    }

    init() {
        this.application = null;
        this.serverList = [ {
            servers: [ 'https://google.com/search' ],
            proxy: "http://localhost/proxy/proxy.php",
            maximumTimeout: -1,
            requestTries: 3,
            requestQueueCount: 5,
            method: NetworkHTTPMethod.GET,
            type: NetworkLoaderType.HTTP,
            requiredParameters: [],
            requiredHeaders: [],
        } ];
    }

}