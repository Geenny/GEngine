export default interface IWork {

    readonly started: boolean;

    start(): void;
    stop(): void;

}