import IVO from "./IVO";

export default interface IVOContainer {

    readonly vo: IVO;

    voBySourceSet( source: any ): void;

}