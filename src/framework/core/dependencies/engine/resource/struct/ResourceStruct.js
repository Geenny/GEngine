import ResourceType from "../enum/ResourceType";

const ResourceStruct = {
    resourceID: -1,
    name: null,
    link: null,
    type: ResourceType.UNKNOWN,
    important: false,           // Нужно загрузить в первую очередь
    dynamic: false,             // Можно выгрузить или загрузить позже
    priority: 0
};

export default ResourceStruct;