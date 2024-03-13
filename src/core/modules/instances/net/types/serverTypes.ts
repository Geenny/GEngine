import { ID } from "data/types/common";
import { ServerMethod } from "../enums/ServerMethod";
import { ServerIPType } from "../enums/ServerIPType";

type ServerOptions = { host: string, port?: number, method?: ServerMethod, ID?: ID, name?: string, ipType?: ServerIPType, isDeafult?: boolean, tries?: number, streams?: number };

export { ServerOptions };