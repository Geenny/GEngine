
import DependencyStruct from "../../framework/core/machines/dependency/struct/DependencyStruct";
import Engine from "../../framework/core/dependencies/engine/source/Engine";
import DependencyIDs from "../../framework/core/dependencies/DependencyIDs";
import EngineVO from "../../framework/core/dependencies/engine/source/vo/EngineVO";
import { MAIN as CONFIG } from "../../framework/config/CONFIG";
// import { merge } from "lodash";
import merge from "webpack-merge";

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
                        dependenceNameList: [ DependencyIDs.SYSTEMS, DependencyIDs.DISPLAYS ]
                    }
                ]
            }
        }
    }
};

const MAIN = merge( CONFIG, ADDITIONAL );

export { MAIN };
