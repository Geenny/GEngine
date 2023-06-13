import { injectable } from "inversify";
import IVO from "../../data/VO/IVO";
import IVOContainer from "../../data/VO/IVOContainer";

@injectable()
export default class VOContainer implements IVOContainer {

    //
    // VO
    //

    private _vo: IVO;
    private _voDefault: IVO = { source: [] };

    public get vo(): IVO { return this._vo; }

    public voBySourceSet( source: any ): void {

        this._vo = source ? this.voBySourceParse( source ) : this._voDefault;

    }

    protected voBySourceParse( source: any ): IVO {

        const vo = { source };

        for ( let name in source ) {
            if ( !Object.hasOwn( vo, name )) return;
            // @ts-ignore
            vo[ name ] = source[ name ];
        }

        return vo;

    }

}