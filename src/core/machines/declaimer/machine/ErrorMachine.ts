import { injectable } from "inversify";
import IErrorMachine from "../interface/IErrorMachine";

@injectable()
export default class ErrorMachine implements IErrorMachine {

    error( id: string, description: string ): void { }

}