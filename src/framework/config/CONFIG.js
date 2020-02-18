import DependencyStruct from "../core/machines/dependency/struct/DependencyStruct";
import Systems from "../core/dependencies/systems/systems/Systems";
import SystemSource from "../core/dependencies/systems/systems/struct/SystemSource";
import DisplaySystem from "../core/dependencies/systems/display/DisplaySystem";
import KeyboardSystem from "../core/dependencies/systems/keyboard/KeyboardSystem";
import DeviceSystem from "../core/dependencies/systems/device/DeviceSystem";
import Net from "../core/dependencies/network/Net";
import NetVO from "../core/dependencies/network/vo/NetVO";
import Displays from "../core/dependencies/displays/Displays";
import DisplaysVO from "../core/dependencies/displays/vo/DisplaysVO";
import { DISPLAY_SYSTEM_NAME, KEYBOARD_SYSTEM_NAME, DEVICE_SYSTEM_NAME, TIME_SYSTEM_NAME, MOUSE_SYSTEM_NAME } from "../constants/Constants";
import DependencyIDs from "../core/dependencies/DependencyIDs";
import TimeSystem from "../core/dependencies/systems/time/TimeSystem";
import MouseSystem from "../core/dependencies/systems/mouse/MouseSystem";

const VIEW_SYSTEM = {
    ... SystemSource,
    class: DisplaySystem,
    options: { name: DISPLAY_SYSTEM_NAME }
};

const KEYBOARD_SYSTEM = {
    ... SystemSource,
    class: KeyboardSystem,
    options: { name: KEYBOARD_SYSTEM_NAME }
};

const DEVICE_SYSTEM = {
    ... SystemSource,
    class: DeviceSystem,
    options: { name: DEVICE_SYSTEM_NAME }
};

const TIME_SYSTEM = {
    ... SystemSource,
    class: TimeSystem,
    options: { name: TIME_SYSTEM_NAME }
};

const MOUSE_SYSTEM = {
    ... SystemSource,
    class: MouseSystem,
    options: { name: MOUSE_SYSTEM_NAME }
};

const MAIN = {
    main: {
        vo: {
            dependencyMachineVO: {
                dependencyStructList: [

                    // Systems 
                    {
                        ... DependencyStruct,
                        ID: DependencyIDs.SYSTEMS,
                        class: Systems,
                        dependenceNameList: [],
                        options: {
                            systemsStartList: [
                                VIEW_SYSTEM,
                                DEVICE_SYSTEM,
                                KEYBOARD_SYSTEM,
                                TIME_SYSTEM,
                                MOUSE_SYSTEM
                            ]
                        }
                    },

                    // Network
                    {
                        ... DependencyStruct,
                        ID: DependencyIDs.NET,
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
                        ID: DependencyIDs.DISPLAYS,
                        class: Displays,
                        classVO: DisplaysVO,
                        dependenceNameList: [ 1 ]
                    }
                ]
            }
        }
    }
}

export { MAIN };
