import { Mesh, Sprite, SpriteMaterial, TextureLoader, PlaneGeometry, MeshPhongMaterial, PlaneBufferGeometry, DoubleSide, Texture } from "three";
import ResourceGenerator from "../../resource/ResourceGenerator";
import Resources from "../../resource/Resources";
import ResourceStruct from "../../resource/struct/ResourceStruct";
import ResourceType from "../../resource/enum/ResourceType";
import PlaneObjectVO from "./vo/PlaneObjectVO";
import InteractiveObject from "./InteractiveObject";

export default class PlaneObject extends InteractiveObject {

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

    _initPlaneObjectVars() {
        this._width = this.vo.width || 512;
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