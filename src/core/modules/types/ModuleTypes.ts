const ModuleType = {
    APPLICATION: Symbol.for( "ModuleApplication" ),
    DEPENDENCY: Symbol.for( "ModuleDependecy" ),
    DISPATCHER: Symbol.for( "ModuleDisptcher" ),
    SYSTEM: Symbol.for( "ModuleSystem" ),
    RENDER: Symbol.for( "ModuleRender" ),
};

export { ModuleType };