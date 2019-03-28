import DependencyStruct from "../../framework/core/machines/dependency/struct/DependencyStruct";
import Systems from "../../framework/core/systems/systems/Systems";
import SystemSource from "../../framework/core/systems/systems/struct/SystemSource";
import DisplaySystem from "../../framework/core/systems/display/DisplaySystem";

const VIEW_SYSTEM = {
    ... SystemSource,
    class: DisplaySystem
};

// const DEVICE_SYSTEM = {
//     ... SystemSource,
//     class: ViewSystem,
//     name: "ViewSystem"
// };

const MAIN = {
    main: {
        vo: {
            dependencyMachineVO: {
                dependencyStructList: [

                    // Systems 
                    {
                        ... DependencyStruct,
                        ID: 1,
                        name: "Systems",
                        class: Systems,
                        options: {
                            dependenceNameList: [],
                            systemsStartList: [
                                VIEW_SYSTEM // ,
                                // DEVICE_SYSTEM,
                                // ORIENTATION_SYSTEM,
                                // KEYBOARD_SYSTEM,
                                // NETWORK_SYSTEM
                            ]
                        }
                    }
                ]
            }
        }
    }
}

export { MAIN };
