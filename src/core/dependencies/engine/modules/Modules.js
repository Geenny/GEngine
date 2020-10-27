import EventDispatcherVOWrapper from "../../../../data/vo/EventDispatcherVOWrapper";
import ModulesVO from "./vo/ModulesVO";
import StructUtils from "../../../../data/content/struct/StructUtils";
import ApplicationEvent from "../../../application/event/ApplicationEvent";
import ModuleEvent from "./event/ModuleEvent";

export default class Modules extends EventDispatcherVOWrapper {

    constructor( vo = new ModulesVO() ) {
        super( vo );
    }


    //
    // GET/SET
    //
    get enable() { return this._enable; }
    set enable( value ) { this._enable = value; }

    get application() { return this.vo.application; }
    get applicationRootName() { return this.vo.applicationRootName || "modules"; }
    get moduleList() { return this._moduleList; }
    get moduleStructList() { return this.vo.moduleStructList || []; }


    //
    // INIT
    //
    init() {
        this._initVars();
    }
    _initVars() {
        this._moduleList = [];
    }


    //
    // DESTROY
    // 
    destroy() {
        while( this._moduleList.length ) {
            const module = this._moduleList.shift();
            module.destroy();
            this.application.rootRemove( module, this.applicationRootName );
        }
    }

    
    resize( size ) {
        this.size = size;
        this.resizeModules();
    }
    resizeModules() {
        if ( !this._moduleList ) return;
        for ( let i = 0; i < this._moduleList.length; i++ ) {
            const module = this._moduleList[ i ];
            module.resize( this.size );
        }
    }

    //
    // MODULES
    //

    moduleCreate( moduleStruct ) {
        try {
            moduleStruct.options.modules = this;
            const module = StructUtils.createStruct( moduleStruct );
            this._moduleList.push( module );
            this.application.rootAdd( module, this.applicationRootName );
            this.application.dispatchEvent( new ModuleEvent( ModuleEvent.START, this, module ) );
        } catch ( error ) {
            const errorData = { errorID: 0, errorMessage: `Module ${moduleStruct.name} create error!!!` };
            this.application.dispatchEvent( new ModuleEvent( ModuleEvent.ERROR, this, null ) );
            this.application.dispatchEvent( new ApplicationEvent( ApplicationEvent.ERROR, errorData ) );
        }
    }
    moduleStart( moduleStruct ) {
        if ( moduleStruct.instance ) return;
        this.moduleCreate( moduleStruct );
        if ( !moduleStruct.instance ) return;
        moduleStruct.instance.size = this.size;
        moduleStruct.instance.init();
        this.application.dispatchEvent( new ModuleEvent( ModuleEvent.INIT, this, moduleStruct.instance ) );
    }

    moduleStartAll() {
        for ( let i = 0; i < this.moduleStructList.length; i++ ) {
            const moduleStruct = this.moduleStructList[ i ];
            this.moduleStart( moduleStruct );
        }
    }

}