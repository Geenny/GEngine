import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";
import ResourceType from "./enum/ResourceType";
import ResourceStruct from "./struct/ResourceStruct";

export default class Resource extends EventDispatcherVOWrapper {

    constructor( resourceVO ) {
        super( resourceVO );
    }

    //
    // GET/SET
    //

    get resourceList() { return this._resourceList; }


    //
    // INIT
    //

    init() {
        this._initVars();
        this._initResourcesFromVO();
    }

    _initVars() {
        this._resourceList = [];
    }


    //
    // RESOURCE
    //

    resourceGetByName( resourceName ) {
        
    }

    resourceAdd( data ) {
        const resourceStruct = { ... ResourceStruct };
        resourceStruct.type = this._resourceTypeCheck( data.type ) ? data.type : resourceStruct.type;
        resourceStruct.name = this._resourceNameCheck( data.name ) ? data.name : null;
    }

    // resourceDataCorrection( data ) {
    //     if ( this._resourceTypeCheck( data.type ) )
    // }

    _resourceTypeCheck( resourceType ) {
        for ( const key in ResourceType ) {
            if ( ResourceType[ key ] != resourceType ) continue;
            return true;
        }
        return false;
    }

    _resourceNameCheck( resourceName ) {
        if ( resourceName ) {
            for ( let i = 0; i < this._resourceList.length; i++ ) {
                const resourceStruct = this._resourceList[ i ];
                if ( resourceStruct.name != resourceName ) continue;
                return false;
            }
        }
        return true;
    }

}