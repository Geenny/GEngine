import Event from "../../../../framework/core/machines/event/Event";

export default class GameEvent extends Event {}

GameEvent.NONE = "none";
GameEvent.READY = "gameReady";