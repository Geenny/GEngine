const ModuleType = {
    APPLICATION: Symbol.for( "ModuleApplication" ),
    DEPENDENCY: Symbol.for( "ModuleDependecy" ),
    DISPATCHER: Symbol.for( "ModuleDisptcher" ),
    NET: Symbol.for( "ModuleNet" ),
    PLATFORM: Symbol.for( "ModulePlatform" ),
    SYSTEM: Symbol.for( "ModuleSystem" ),
    RENDER: Symbol.for( "ModuleRender" ),
};

export { ModuleType };