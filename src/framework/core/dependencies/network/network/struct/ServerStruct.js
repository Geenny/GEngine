const ServerStruct = {
    ID: 0,              // Server ID
    name: null,         // Server name
    server: null,
    servers: null,
    port: 0,
    ping: 0,
    proxy: null,
    method: null,
    loader: null,
    type: null,         // NetworkLoaderType
    loaderClass: null, 
    timeoutMaximum: -1,
    requestTries: 3,
    requestQueueCount: 5,
    requiredParameters: [],
    requiredHeaders: [],
    options: {},
    sourceData: {},

    onabort: [],
    onerror: [],
    onload: [],
    onprogress: []
}

export default ServerStruct;