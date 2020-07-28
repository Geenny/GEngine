import { Mesh, Sprite, SpriteMaterial, TextureLoader, PlaneGeometry, MeshPhongMaterial, PlaneBufferGeometry, DoubleSide, Texture } from "three";
import ResourceGenerator from "../../modules/modules/resource/ResourceGenerator";
import Resources from "../../modules/modules/resource/Resources";
import ResourceStruct from "../../modules/modules/resource/struct/ResourceStruct";
import ResourceType from "../../modules/modules/resource/enum/ResourceType";
import PlaneObjectVO from "./vo/PlaneObjectVO";
import DisplayObject from "./DisplayObject";

export default class PlaneObject extends DisplayObject {

    /**
     * 
     * @param { PlaneObjectVO } planeObjectVO
     */
    constructor( planeObjectVO ) {
        super( planeObjectVO );
    }

    //
    // GET/SET
    //


    //
    // INIT
    //

    init() {
        super.init();
        this._initPlaneObjectVars();
        this._initTexture();
        this.redraw();
    }

    _initTexture() {
        if ( this.texture ) return;

        const resourceStruct = { ...ResourceStruct };
        resourceStruct.textureName = this.vo.textureName;
        resourceStruct.type = ResourceType.TEXTURE;
        resourceStruct.onComplete = this.textureSet.bind( this );

        Resources.resourceGet( resourceStruct );
    }
    textureByIDSet( textureID ) {
        
    }

    _initPlaneObjectVars() {
        this._width = this.vo.width || 256;
        this._height = this.vo.height || 256;
    }


    //
    // DRAW
    //

    redraw() {
        this.clear();
        this._draw();
    }

    clear() { }

    displayObjectUpdate() {
        if ( !this.texture ) return;
        this.width = this.texture.image.width;
        this.height = this.texture.image.height;
    }

    _draw() {
        if ( !this._object3D ) {
            this._object3D = this.createObject3D();
        }
    }


    //
    // GEOMETRY
    //

    geometryCreate() {
        return new PlaneBufferGeometry( this._width, this._height, this.vo.segmentWidth, this.vo.segmentHeight );
    }


    //
    // OBJECT3D
    //

    createObject3D() {
        const material = this.materialCreate();
        const geometry = this.geometryCreate();
        const mesh = new Mesh( geometry, material );

        this._material = mesh.material;
        this._geometry = mesh.geometry;

        return mesh;
    }

}