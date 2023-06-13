export default interface IWork {

    readonly isWorking: boolean;

    start(): void;

    stop(): void;

}