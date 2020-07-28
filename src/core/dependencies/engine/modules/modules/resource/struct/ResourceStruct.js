import ResourceType from "../enum/ResourceEnum";

const ResourceStruct = {
    ID: -1,
    name: null,
    url: null,
    content: null,
    type: ResourceType.UNKNOWN,
    important: false,           // Нужно загрузить в первую очередь
    dynamic: false,             // Можно выгрузить или загрузить позже
    priority: 0,
    onComplete: null
};

export default ResourceStruct;