import { ObjectListAny } from "data/types/commonTypes";

type ServerData = { host: string, post?: number, tries?: number };

type RequestData = { type: string, data?: ObjectListAny, serverData?: ServerData, priority?: number };

export { ServerData, RequestData };