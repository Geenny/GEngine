import { ID, ObjectListAny } from "data/types/common";

const DependencyType = {
    DEPENDENCY_MACHINE: Symbol.for( "DependencyMachine" ),
    DEPENDENCY: Symbol.for( "Dependency" ),
    DEPENDENCY_FACTORY: Symbol.for( "DependencyFactory" ),
    DEPENDENCY_NAMED_FACTORY: Symbol.for( "DependencyNamedFactory" ),
}

type ObjectListDependency = { ID: ID, name: string, dependent: ID[], options: ObjectListAny }

export { DependencyType, ObjectListDependency };