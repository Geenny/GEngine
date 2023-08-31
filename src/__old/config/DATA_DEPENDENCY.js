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
import Engine from "../core/dependencies/engine/source/Engine";
import EngineVO from "../core/dependencies/engine/source/vo/EngineVO";
import PixiView from "../core/dependencies/engine/modules/modules/view/PixiView";
import ModuleVO from "../core/dependencies/engine/modules/vo/ModuleVO";
import Resources from "../core/dependencies/engine/modules/modules/resource/Resources";
import ResourcesVO from "../core/dependencies/engine/modules/modules/resource/vo/ResourcesVO";
import PixiResource from "../core/dependencies/engine/modules/modules/resource/resources/PixiResource";
import ScreenManager from "../core/dependencies/engine/modules/modules/screen/ScreenManager";
import ScreenManagerVO from "../core/dependencies/engine/modules/modules/screen/vo/ScreenManagerVO";
import { DISPLAY_SYSTEM_NAME, KEYBOARD_SYSTEM_NAME, DEVICE_SYSTEM_NAME, TIME_SYSTEM_NAME, MOUSE_SYSTEM_NAME } from "../constants/Constants";
import DependencyIDs from "../core/dependencies/DependencyIDs";
import DependencyName from "../core/dependencies/DependencyName";
import TimeSystem from "../core/dependencies/systems/time/TimeSystem";
import MouseSystem from "../core/dependencies/systems/mouse/MouseSystem";
import NetworkHTTPMethod from "../core/dependencies/network/constants/NetworkHTTPMethod";
import NetworkLoaderType from "../core/dependencies/network/constants/NetworkLoaderType";
import PixiScreenBuilderStruct from "../core/dependencies/engine/modules/modules/screen/pixi/struct/PixiScreenBuilderStruct";
import Struct from "../data/content/struct/Struct";
import Sounds from "../core/dependencies/engine/modules/modules/sound/Sounds";
import SoundsVO from "../core/dependencies/engine/modules/modules/sound/vo/SoundsVO";
import SCREENS from "./SCREENS";
import Platform from "../core/dependencies/platform/Platform";
import PlatformVO from "../core/dependencies/platform/vo/PlatformVO";
import PlatformName from "../core/dependencies/platform/constants/PlatformName";
import Launcher from "../core/dependencies/launcher/Launcher";

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

const DATA = {
    dependencyStructList: [

        // Systems 
        {
            ... DependencyStruct,
            ID: DependencyIDs.SYSTEMS,
            name: DependencyName.SYSTEMS,
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

        // Net
        {
            ... DependencyStruct,
            ID: DependencyIDs.NET,
            name: DependencyName.NET,
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
                        requestQueueCount: 20,
                        method: NetworkHTTPMethod.GET,
                        type: NetworkLoaderType.HTTP
                    },
                    {
                        name: "google",
                        urls: [ 'https://google.com/search' ],
                        maximumTimeout: -1,
                        requestTries: 3,
                        requestQueueCount: 20,
                        method: NetworkHTTPMethod.GET,
                        type: NetworkLoaderType.HTTP
                    }
                ]
            }
        },

        // Display or displays
        {
            ...DependencyStruct,
            ID: DependencyIDs.DISPLAYS,
            name: DependencyName.DISPLAYS,
            class: Displays,
            classVO: DisplaysVO,
            dependenceNameList: [ DependencyIDs.SYSTEMS ]
        },

        // Engine
        {
            ... DependencyStruct,
            ID: DependencyIDs.ENGINE,
            name: DependencyName.ENGINE,
            class: Engine,
            classVO: EngineVO,
            dependenceNameList: [ DependencyIDs.NET, DependencyIDs.SYSTEMS, DependencyIDs.DISPLAYS ],
            options: {
                modulesVOData: {
                    moduleStructList: [
                        {
                            ... Struct,
                            ID: 1,
                            name: "view",
                            class: PixiView,
                            classVO: ModuleVO
                        },
                        {
                            ... Struct,
                            ID: 2,
                            name: "resources",
                            class: Resources,
                            classVO: ResourcesVO,
                            options: {
                                ResourceClass: PixiResource,
                                resourceLink: "./assets/assets.json"
                            }
                        },
                        {
                            ... Struct,
                            ID: 3,
                            name: "screenManager",
                            class: ScreenManager,
                            classVO: ScreenManagerVO,
                            options: {
                                screenBuilderStruct: { ... PixiScreenBuilderStruct },
                                screenStructList: SCREENS
                            }
                        },
                        {
                            ... Struct,
                            ID: 4,
                            name: "sounds",
                            class: Sounds,
                            classVO: SoundsVO
                        }
                    ]
                }
            }
        },

        // Platform
        {
            ... DependencyStruct,
            ID: DependencyIDs.PLATFORM,
            name: DependencyName.PLATFORM,
            class: Platform,
            classVO: PlatformVO,
            dependenceNameList: [ DependencyIDs.ENGINE ],
            options: {
                // platformName: PlatformName.FB
                platformName: PlatformName.NONE
            }
        },

        // Launcher
        {
            ... DependencyStruct,
            ID: DependencyIDs.LAUNCHER,
            name: DependencyName.LAUNCHER,
            class: Launcher,
            dependenceNameList: [ DependencyIDs.ENGINE ]
        }

        // Game 
        // {
        //     ... DependencyStruct,
        //     ID: DependencyIDs.GAME,
        //     name: DependencyName.GAME,
        //     class: Game,
        //     classVO: GameVO,
        //     dependenceNameList: [ DependencyIDs.ENGINE, DependencyIDs.PLATFORM ]
        // }
    ]
};

export default DATA;