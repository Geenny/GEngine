const ApplicationType = {
    APPLICATION: Symbol.for("Application"),
    DISPATCHER: Symbol.for("EventDispatcher"),
    LOG: Symbol.for("Log"),
    OPTIONS: Symbol.for("Options"),
    DEPENDENCY_MACHINE: Symbol.for("DependencyMachine")
}

export default ApplicationType;