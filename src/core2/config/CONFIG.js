
import DependencyStruct from "../../framework/core/machines/dependency/struct/DependencyStruct";
import Engine from "../../framework/core/dependencies/engine/source/Engine";
import DependencyIDs from "../../framework/core/dependencies/DependencyIDs";
import EngineVO from "../../framework/core/dependencies/engine/source/vo/EngineVO";
import { MAIN as CONFIG } from "../../framework/config/CONFIG";
// import { merge } from "lodash";
import merge from "webpack-merge";
import Net from "../../framework/core/dependencies/network/Net";
import NetVO from "../../framework/core/dependencies/network/vo/NetVO";
import NetworkHTTPMethod from "../../framework/core/dependencies/network/constants/NetworkHTTPMethod";
import NetworkLoaderType from "../../framework/core/dependencies/network/constants/NetworkLoaderType";

const ADDITIONAL = {
    main: {
        vo: {
            dependencyMachineVO: {
                dependencyStructList: [

                    // Engine 
                    {
                        ... DependencyStruct,
                        ID: DependencyIDs.ENGINE,
                        class: Engine,
                        classVO: EngineVO,
                        dependenceNameList: [ DependencyIDs.SYSTEMS, DependencyIDs.DISPLAYS ],
                        options: {
                            resourceVOData: {
                                resourceLink: "./assets/assets.config"
                            }
                        }
                    },

                    // Net
                    {
                        ... DependencyStruct,
                        ID: DependencyIDs.NET,
                        class: Net,
                        classVO: NetVO,
                        dependenceNameList: [],
                        options: {
                            serverList: [
                                {
                                    name: "default",
                                    urls: [ 'http://localhost:8900' ],
                                    maximumTimeout: -1,
                                    requestTries: 3,
                                    requestQueueCount: 5,
                                    method: NetworkHTTPMethod.GET,
                                    type: NetworkLoaderType.HTTP
                                },
                                {
                                    name: "google",
                                    urls: [ 'https://google.com/search' ],
                                    maximumTimeout: -1,
                                    requestTries: 3,
                                    requestQueueCount: 5,
                                    method: NetworkHTTPMethod.GET,
                                    type: NetworkLoaderType.HTTP
                                }
                            ]
                        }
                    }
                ]
            }
        }
    }
};

const MAIN = merge( CONFIG, ADDITIONAL );

export { MAIN };
