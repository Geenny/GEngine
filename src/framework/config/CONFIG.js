import DependencyStruct from "../core/machines/dependency/struct/DependencyStruct";
import Systems from "../core/dependencies/systems/systems/Systems";
import SystemSource from "../core/dependencies/systems/systems/struct/SystemSource";
import DisplaySystem from "../core/dependencies/systems/display/DisplaySystem";
import KeyboardSystem from "../core/dependencies/systems/keyboard/KeyboardSystem";
import DeviceSystem from "../core/dependencies/systems/device/DeviceSystem";
import Net from "../core/dependencies/network/network/Net";
import NetVO from "../core/dependencies/network/network/vo/NetVO";
import Displays from "../core/dependencies/displays/Displays";
import DisplaysVO from "../core/dependencies/displays/vo/DisplaysVO";

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
                    },
                    // 
                    // Launcher
                    //

                    // Display or displays
                    {
                        ...DependencyStruct,
                        ID: 10,
                        class: Displays,
                        classVO: DisplaysVO,
                        dependenceNameList: []
                    }
                ]
            }
        }
    }
}

export { MAIN };
