import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";
import ResourceType from "./enum/ResourceType";
import ResourceStruct from "./struct/ResourceStruct";
import ResourceEvent from "./event/ResourceEvent";
import Resource from "./Resource";
import ResourcesVO from "./vo/ResourcesVO";
import ObjectUtils from "../../../../utils/tech/ObjectUtils";
import ArrayUtils from "../../../../utils/tech/ArrayUtils";
import FileType from "./constants/FileType";
import Event from "../../../machines/event/Event";

export default class Resources extends EventDispatcherVOWrapper {

    static resourceGet( resourceStruct ) {
        if ( !Resources.instance ) Resources.instance = new Resources();
        return Resources.instance.resourceGet( resourceStruct );
    }

    constructor( resourceVO = new ResourcesVO() ) {
        super( resourceVO );
    }

    //
    // GET/SET
    //

    get resourceList() { return this._resourceList; }

    get isMain() { return Resources.instance === this; }


    //
    // INIT
    //

    init() {
        this._initVars();
        this._initMainResources();
        this._initResourcesFromVO();
        this._loadAssetList();
    }

    _initVars() {
        this._resourceList = [];
        this._assetList = [];
    }

    _initMainResources() {
        if ( Resources.instance ) return;
        Resources.instance = this;
    }


    //
    // RESOURCE
    //

    resourceAdd( resourceStruct ) {
        const resource = this._resourceCreate( resourceStruct );
        this._resourceAddToList( resource );
        this._resourceLoadStart( resource );
        return resource;
    }

    resourceByDataAdd( resourceData ) {
        const resourceStruct = { ... ResourceStruct };
        resourceStruct.type = this._resourceTypeCheck( resourceData.type ) ? resourceData.type : resourceStruct.type;
        resourceStruct.name = this._resourceNameCheck( resourceData.name ) ? resourceData.name : null;
        const resource = this.resourceAdd( resourceStruct );
        return resource;
    }

    resourceGet( resourceStruct ) {
        let resource = ArrayUtils.findAsObject( this._resourceList, "resourceStruct", resourceStruct );
        resource = resource || this.resourceAdd( resourceStruct );
        return resource;
    }

    resourceGetByName( resourceName ) {
        return ArrayUtils.findAsObject( this._resourceList, "name", resourceName );
    }

    _resourceTypeCheck( resourceType ) {
        return ObjectUtils.inValues( ResourceType, resourceType );
    }
    _resourceNameCheck( resourceName ) {
        return !ArrayUtils.findAsObject( this._resourceList, "name", resourceName );
    }
    _resourceCorrectUrl( resource ) {
        const resourceStruct = resource.resourceStruct;
        if ( !resourceStruct.url ) {
            for ( let i = 0; i < this._assetList.length; i++ ) {
                const assetData = this._assetList[ i ];
                if ( assetData.name != resourceStruct.textureName ) continue;
                resourceStruct.url = assetData.url;
            }
        }
    }
    _resourceCorrectType( resource ) {
        const resourceStruct = resource.resourceStruct;
        if ( !resourceStruct.type && resourceStruct.url ) {
            for ( const key in FileType ) {
                const fileType = FileType[ key ];
                if ( resourceStruct.url.indexOf( fileType ) != resourceStruct.url.length - fileType.length ) continue;
                resourceStruct.type = this._resourceGetTypeByFileType( fileType );
            }
        }
        return resourceStruct;
    }
    _resourceGetTypeByFileType( fileType ) {
        switch( fileType ) {
            case FileType.JSON:
                return  ResourceType.JSON;
            
            case FileType.JPEG:
            case FileType.PNG:
                return  ResourceType.IMAGE;
            
            case FileType.MP3:
            case FileType.M4A:
                return ResourceType.SOUND;
        }
        return null;
    }
    _resourceCreate( resourceStruct ) {
        return new Resource( resourceStruct );
    }
    _resourceAddToList( resource ) {
        this._resourceList.push( resource );
    }
    _resourceLoadStart( resource ) {
        if ( resource.state != ResourceEvent.NONE ) return;
        if ( !resource.resourceStruct.url ) this._resourceCorrectUrl( resource );
        if ( !resource.resourceStruct.type ) this._resourceCorrectType( resource );
        if ( !resource.resourceStruct.url ) return;
        resource.addEventListener( Event.ANY, this._resourceHandler, this );
        resource.load();
    }
    _resourceLoadStartAll() {
        for ( let i = 0; i < this._resourceList.length; i++ ) {
            const resource = this._resourceList[ i ];
            this._resourceLoadStart( resource );
        }
    }
    _resourceHandler( event ) {
        if ( event.type === ResourceEvent.READY ) {
            const resource = event.target;
            resource.removeEventListener( Event.ANY, this._resourceHandler );
        }
    }

    _initResourcesFromVO() {
        if ( !Array.isArray( this.vo.resourceDataList ) ) return;
        for ( let i = 0; i < this.vo.resourceDataList.length; i++ ) {
            const resourceData = this.vo.resourceDataList[ i ];
            this.resourceByDataAdd( resourceData );
        }
    }

    //
    // ASSET LIST
    //

    _loadAssetList() {
        const resourceStruct = { ...ResourceStruct };
        resourceStruct.name = "assets";
        resourceStruct.url = "assets/assets.json";
        resourceStruct.onComplete = this._loadAssetListComplete.bind( this );
        this.resourceGet( resourceStruct );
    }
    _loadAssetListComplete( content ) {
        this._assetList = content && content.list ? content.list : [];
        this._resourceLoadStartAll();
    }

}