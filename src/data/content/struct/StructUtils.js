export default class StructUtils {

    /**
     * Создать @Struct на основании @Class и его @ClassVO и заполнить в struct
     * @param { Struct } struct 
     * @param { Class } StructClass 
     * @param { ClassVO } StructVOClass 
     */
    static createStruct( struct, StructClass, StructVOClass ) {
        StructClass = struct.class || StructClass;
        StructVOClass = struct.classVO || StructVOClass;

        const structVOData = struct.options;
        const structVO = new StructVOClass( structVOData );

        structVO.ID = struct.ID || structVO.ID;
        structVO.name = struct.name || structVO.name;

        const structInstance = new StructClass( structVO );
        struct.instance = structInstance;
        struct.instanceVO = structVO;
        return structInstance;
    }

}