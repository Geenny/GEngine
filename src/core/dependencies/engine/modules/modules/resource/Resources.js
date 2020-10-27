import ResourceStruct from "./struct/ResourceStruct";
import ResourceEvent from "./event/ResourceEvent";
import ResourcesVO from "./vo/ResourcesVO";
import ObjectUtils from "../../../../../../utils/tech/ObjectUtils";
import ArrayUtils from "../../../../../../utils/tech/ArrayUtils";
import FileType from "./constants/FileType";
import Event from "../../../../../machines/event/Event";
import Module from "../../Module";
import ResourceType from "./constants/ResourceType";
import ResourcesEvent from "./event/ResourcesEvent";
import ResourceState from "./states/ResourceState";
import ResourcePreloadStruct from "./struct/ResourcePreloadStruct";
import Resource from "./resources/Resource";

export default class Resources extends Module {

    static resourceGet( resourceStruct ) {
        if ( !Resources.instance ) Resources.instance = new Resources();
        return Resources.instance.resourceGet( resourceStruct );
    }

    static resourceGetByName( resourceName ) {
        if ( !Resources.instance ) Resources.instance = new Resources();
        return Resources.instance.resourceGetByName( resourceName );
    }

    constructor( resourcesVO = new ResourcesVO() ) {
        super( resourcesVO );
    }

    //
    // GET/SET
    //

    get resourceList() { return this._resourceList; }

    get isMain() { return Resources.instance === this; }

    /**
     * мс
     */
    get loadinTickTime() { return this.vo.loadingTickTime > 0 ? this.vo.loadingTickTime : 100; }


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
        this._assetPreloadList = [];
        this._resourceLoadingList = [];
        this._resourcePreloadList = [];
    }

    _initMainResources() {
        if ( Resources.instance ) return;
        Resources.instance = this;
    }


    //
    // DESTROY
    //
    destroy() {
        while ( this._resourceLoadingList.length ) {
            const resource = this._resourceLoadingList.shift();
            resource.removeEventListener( Event.ANY, this._resourceHandler );
        }
        this._loadingProgressStop();
        ObjectUtils.destroyList( this._resourceList );
        ObjectUtils.destroyList( this._resourceLoadingList );

        Resources.instance = null;
    }


    //
    // RESOURCE
    //

    resourceAdd( resourceStruct, loadStart = false ) {
        const resource = this._resourceCreate( resourceStruct );
        resource.ID = ArrayUtils.uniqueIDGet( this._resourceList );
        this._resourceAddToList( resource );
        if ( loadStart ) this._resourceLoadStart( resource );
        return resource;
    }

    resourceByDataAdd( resourceData, loadStart = false ) {
        const resourceStruct = { ... ResourceStruct, ... resourceData };
        resourceStruct.type = this._resourceTypeCheck( resourceData.type ) ? resourceData.type : resourceStruct.type;
        resourceStruct.name = this._resourceNameCheck( resourceData.name ) ? resourceData.name : null;
        const resource = this.resourceAdd( resourceStruct, loadStart );
        return resource;
    }

    resourceGet( resourceStruct ) {
        let resource = ArrayUtils.findAsObject( this._resourceList, "resourceStruct", resourceStruct );
        resource = resource || this.resourceAdd( resourceStruct, true );
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
                resourceStruct.type = this._resourceTypeByFileTypeGet( fileType );
            }
        }
        return resourceStruct;
    }
    _resourceTypeByFileTypeGet( fileType ) {
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
        const ResourceClass = this.vo.ResourceClass;
        return new ResourceClass( resourceStruct );
    }
    _resourceAddToList( resource ) {
        this._resourceList.push( resource );
        this.dispatchEvent( new ResourcesEvent( ResourcesEvent.ADD, this, { resource } ) );
    }
    _resourceLoadStart( resource ) {
        if ( !( resource instanceof Resource ) ) return;
        if ( resource.state != ResourceState.NONE ) return;
        if ( !resource.url ) this._resourceCorrectUrl( resource );
        if ( !resource.type ) this._resourceCorrectType( resource );
        if ( !resource.url ) return;
        this._loadingResourceAdd( resource );
        resource.addEventListener( Event.ANY, this._resourceHandler, this );
        resource.load();
    }
    _resourceLoadReady( resource ) {
        resource.removeEventListener( Event.ANY, this._resourceHandler );
        this._loadingResourceRemove( resource );
    }
    _resourcePreloadStartList( list, listName = "" ) {
        this._resourceLoadFromList( list, listName );
        this._loadingTickHandler();
    }
    _resourceLoadFromList( resourceList, listName = "" ) {
        for ( let i = 0; i < resourceList.length; i++ ) {
            const resource = resourceList[ i ];
            this._resourceLoadStart( resource );
        }
        this._resourceListProgressAdd( resourceList, listName );
    }
    _resourceHandler( event ) {
        const resource = event.target;
        if ( event.type === ResourceEvent.COMPLETE ) {
            this._resourceLoadReady( resource );
        } else if ( event.type === ResourceEvent.ERROR ) {
            this._resourceLoadReady( resource );
        }
    }
    _resourceListProgressAdd( list, name ) {
        const resourcePreloadStrust = { ...ResourcePreloadStruct, name, list };
        this._resourcePreloadList.push( resourcePreloadStrust );
    }
    _resourceListProgressRemove( list ) {
        const index = this._resourcePreloadList.indexOf( list );
        if ( index < 0 ) return;
        this._resourcePreloadList.splice( index, 1 );
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
        const resourceStruct = {
            ...ResourceStruct,
            name: "Assets",
            url: this.vo.resourceLink,
            type: ResourceType.JSON,
            onComplete: this._loadAssetListComplete.bind( this )
        };
        this.resourceGet( resourceStruct );
    }
    _loadAssetListComplete( content ) {
        this._assetPreloadList = content && Array.isArray( content.preload ) ? content.preload : [];
        this._assetList = content && Array.isArray( content.list ) ? content.list : [];
        const resourceList = this._initResourcesFromAssets( this._assetPreloadList );
        this._resourcePreloadStartList( resourceList, "Preload" );
    }
    _initResourcesFromAssets( assetList ) {
        const resourceList = [];
        if ( !Array.isArray( assetList ) ) return resourceList;
        for ( let i = 0; i < assetList.length; i++ ) {
            let resourceData = assetList[ i ];
            this._resourceDataTypeConvert( resourceData );
            const resource = this.resourceByDataAdd( resourceData );
            resourceList.push( resource );
        }
        return resourceList;
    }
    _resourceDataTypeConvert( resourceData ) {
        const enumerate = ResourceType[ resourceData.type ];
        resourceData.type = typeof enumerate === "number" ? enumerate : resourceData.type;
    }


    //
    // LOADING
    //
    _loadingResourceAdd( resource ) {
        if ( !resource ) return;
        this._resourceLoadingList.push( resource );
        this._loadingProgressStart();
    }
    _loadingResourceRemove( resource ) {
        if ( !resource ) return;
        const index = this._resourceLoadingList.indexOf( resource );
        if ( index < 0 ) return;
        this._resourceLoadingList.splice( index, 1 );
        this._loadingTickHandler();
        this._loadingProgressStopCheck();
    }
    _loadingProgressStart() {
        if ( this.loadingInterval ) return;
        const loadingTickHandler = this._loadingTickHandler.bind( this );
        this.loadingInterval = setInterval( loadingTickHandler, this.loadinTickTime );
    }
    _loadingProgressStop() {
        if ( !this.loadingInterval ) return;
        clearInterval( this.loadingInterval );
        this.loadingInterval = null;
    }
    _loadingProgressReady() {
        this.dispatchEvent( new ResourcesEvent( ResourcesEvent.READY, this, { } ) );
    }
    _loadingProgressStopCheck() {
        if ( this._resourceLoadingList.length === 0 ) {
            this._loadingProgressReady();
            this._loadingProgressStop();
            return true;
        }
        return false;
    }
    _loadingTickHandler() {
        for ( let i = 0; i < this._resourcePreloadList.length; i++ ) {
            const resourcePreloadList = this._resourcePreloadList[ i ];
            resourcePreloadList.progress = this._loadingProgressGet( resourcePreloadList.list );
            this.dispatchEvent( new ResourcesEvent( ResourcesEvent.PROGRESS, this, resourcePreloadList ) );
        }
    }
    _loadingProgressGet( list ) {
        let progress = 0;
        for ( let i = 0; i < list.length; i++ ) {
            const resource = list[ i ];
            progress += resource.progress;
        }
        return progress / list.length;
    }

}