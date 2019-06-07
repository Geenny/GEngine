import DependencyStruct from "../core/machines/dependency/struct/DependencyStruct";
import Systems from "../core/systems/systems/Systems";
import SystemSource from "../core/systems/systems/struct/SystemSource";
import DisplaySystem from "../core/systems/display/DisplaySystem";
import KeyboardSystem from "../core/systems/keyboard/KeyboardSystem";
import DeviceSystem from "../core/systems/device/DeviceSystem";
import Net from "../core/network/network/Net";
import NetVO from "../core/network/network/vo/NetVO";

const VIEW_SYSTEM = {
    ... SystemSource,
    class: DisplaySystem
};

const KEYBOARD_SYSTEM = {
    ... SystemSource,
    class: KeyboardSystem
};

const DEVICE_SYSTEM = {
    ... SystemSource,
    class: DeviceSystem
};

const MAIN = {
    main: {
        vo: {
            dependencyMachineVO: {
                dependencyStructList: [

                    // Systems 
                    {
                        ... DependencyStruct,
                        ID: 1,
                        class: Systems,
                        dependenceNameList: [],
                        options: {
                            systemsStartList: [
                                VIEW_SYSTEM,
                                DEVICE_SYSTEM,
                                KEYBOARD_SYSTEM
                            ]
                        }
                    },

                    // Network
                    {
                        ... DependencyStruct,
                        ID: 2,
                        class: Net,
                        classVO: NetVO,
                        dependenceNameList: []
                    }
                    // 
                    // Launcher
                    // 
                ]
            }
        }
    }
}

export { MAIN };
