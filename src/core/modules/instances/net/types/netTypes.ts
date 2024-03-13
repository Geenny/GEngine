import { ObjectListAny } from "data/types/common";
import { ServerOptions } from "./serverTypes";

type RequestData = { type: string, data?: ObjectListAny, serverOptions?: ServerOptions, priority?: number };

export { RequestData };