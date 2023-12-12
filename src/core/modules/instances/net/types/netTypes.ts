import { ObjectListAny } from "data/types/commonTypes";
import { ServerOptions } from "./serverTypes";

type RequestData = { type: string, data?: ObjectListAny, serverOptions?: ServerOptions, priority?: number };

export { RequestData };