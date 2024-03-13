import IEventDispatcher from "core/machines/event/interface/IEventDispatcher";
import { ObjectListMethod } from "data/types/common";

export default interface ISubscriptioStruct {

	readonly target: IEventDispatcher;

	methods: ObjectListMethod;

}