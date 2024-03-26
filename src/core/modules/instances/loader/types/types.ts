import { ID, NAME } from "data/types/common";
import { LoaderTypeEnum } from "../enum/enums";

const LoaderManagerType = {
    LOADER_MANAGER: Symbol.for( "LoaderManager" )
}

type ObjectListLoader = { ID: ID, name: NAME, type: LoaderTypeEnum }

export { LoaderManagerType, ObjectListLoader };