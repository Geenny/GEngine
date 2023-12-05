import { injectable } from "inversify";
import Dependency from "../../dependency/dependency/Dependency";
import IUser from "./interface/IUser";

@injectable()
export default class User extends Dependency implements IUser {

}