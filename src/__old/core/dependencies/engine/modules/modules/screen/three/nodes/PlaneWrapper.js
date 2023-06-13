import { Material, Object3D } from "three";
import Resource from "../../../resource/resources/Resource";

export default class PlaneWrapper extends Object3D {
    
    constructor( parameters = {} ) {
        super();
        this.parameters = parameters;
    }


    //
    // GET/SET
    //
    get enable() { return this._enable === undefined ? true : this._enable; }
    set enable( value ) {
        if ( value === this.enable ) return;
        this._enable = value;
    }

    get resourceName() { return this._resourceName; }
    set resourceName( value ) {
        if ( value && this.resourceName === value ) return;
        this._resourceName = value;
        this.resourceUpdate();
    }

    get resource() { return this._resource; }
    
    get parameters() { return this._parameters; }
    set parameters( value ) {
        this._parameters = value || {};
        if ( !this._parameters.resourceName ) return;
        this.resourceName = this._parameters.resourceName;
    }


    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
    }


    //
    // RESOURCE
    //
    resourceUpdate() {
        this.resourceMaterialUpdate( this.resourceName, null, true );
    }
    materialSet( material ) {
        this.material = material;
    }

    /**
     * Шаблонное обновление текстуры
     * @param { Object } resourceStruct Объект { target, value }
     */
    resourceMaterialUpdate( value, callback, isMain = false ) {
        const materialSet = this.materialSet.bind( this );

        function update( value ) {
            debugger;
            if ( callback ) callback( value );
            if ( isMain ) materialSet( value );
        }

        if ( value instanceof Material ) {
            update( value );
        } else if ( typeof value === "string" ) {
            Resource.contentByNameSet( value, update );
        }
    }

}