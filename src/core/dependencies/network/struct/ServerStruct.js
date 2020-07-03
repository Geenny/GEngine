import NetworkLoaderType from "../constants/NetworkLoaderType";

const ServerStruct = {
    ID: 0,              // Server ID
    name: null,         // Server name
    url: null,
    urls: null,
    port: 0,
    ping: 0,
    proxy: null,
    method: null,
    loader: null,
    type: NetworkLoaderType.HTTP,         // NetworkLoaderType
    loaderClass: null, 
    timeoutMaximum: -1,
    requestTries: 3,
    requestQueueCount: 5,
    requiredParameters: [],
    requiredHeaders: [],
    options: {},
    sourceData: {},
    once: false,

    onabort: [],
    onerror: [],
    onload: [],
    onprogress: []
}

export default ServerStruct;