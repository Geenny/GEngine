export default interface IInjectionElement {

    readonly name?: string;

    containerName?: string;

    readonly type: string;

    readonly symbol: symbol;

    readonly bindClass?: any;

    readonly toClass: any;
    
    readonly toInterface?: any;

}