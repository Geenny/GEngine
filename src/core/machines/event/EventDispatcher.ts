import { inject, injectable } from "inversify";
import IEventData from "./interface/IEventData";
import IEvent from "./interface/IEvent";
import IEventDispatcher from "./interface/IEventDispatcher";
import Event from "./Event";

@injectable()
export default class EventDispatcher implements IEventDispatcher {

    protected _isLogged: boolean = true;
    protected _dispatcher: EventVO[] = []; 
    protected _stop: boolean = false;
    protected _dispatching: boolean = false;

    /**
     * Logging dispathed data
     */
    public get isLogged(): boolean { return this._isLogged || true; }
    public set isLogged( value: boolean ) { this._isLogged = value; }

    /**
     * Распространение события
     * @param { Event } event Экземпляр @Event 
     * @return { EventDispathcer } Текущий экземпляр @EventDispathcer
     */
    public dispatchEvent( event: Event ): EventDispatcher {
        this._dispatching = true;
        if ( !event.target ) event.setTarget( this );
        // if ( !event.type ) {
        //     throw new Error( ERRORS.E1005 );
        // }
        // if ( this._isLogged ) Log.l( event );
        this._dispatcher.map( eventVO => this.dispatchEventTarget( event, eventVO ));
        this._dispatching = this._stop = false;
        return this;
    }

    /**
     * Возвращает значение наличия события по входящим параметрам
     * @param { String } type Имя события
     * @param  {Function } handler Метод для проверки привязки события непосредственно
     *    к этому метода
     * @return { Boolean }
     */
    public hasEventListener( type: string, handler: Function | undefined = undefined ): boolean {
        this._dispatcher.forEach( target => {
            if ( target.type === type ) {
                return handler === undefined ||
                    handler === target.handler;
            }
        });
        return false;
    }

    /**
     * Добавление события по имени события и методу возврата
     * @param { String } type Имя события
     * @param { Fucntion } handler Метод возврата события
     * @param { EventDispatcher } context Место вызова события
     * @param { Boolean } useCapture 
     * @param { Number } priority 
     */
    public addEventListener(
        type: string,
        handler: Function,
        context?: EventDispatcher,
        useCapture: boolean = false,
        priority: number = 0
    ): EventDispatcher | undefined {
        if ( !type || !handler ) return undefined;

        const event = new EventVO( {
            type,
            handler,
            context,
            binded: context ? handler.bind( context ) : undefined,
            useCapture,
            priority
        } );

        this._dispatcher.push( event );
        this._dispatcher.sort((a, b) => a.priority - b.priority);

        return this;
    }

    /**
     * Удаление события
     * @param { String } type Имя события
     * @param { Fucntion } handler Метод возврата события
     */
    public removeEventListener( type: string, handler?: Function ): EventDispatcher | undefined {
        if ( !type ) return undefined;
        let index = this._dispatcher.length;
        while ( --index > 0 ) {
            const event = this._dispatcher[ index ]
            if ( event.type !== type ) continue;
            if ( handler === undefined || handler === event.handler ) {
                this._dispatcher.splice( index, 1 )
            }
        }
        return this;
    }

    /**
     * Удаляет все события данного вещателя событий
     */
    public removeAllListeners(): EventDispatcher {
        this._dispatcher.splice( 0, this._dispatcher.length );
        return this;
    }

    /**
     * Stopping dispatching if it is in progress
     */
    public stopPropagation() {
        this._stop = this._dispatching;
    }

    protected dispatchEventTarget( event: Event, eventVO: EventVO ): void {
        if ( this._stop ) return;
        if ( !eventVO ) return;
        if ( !eventVO.handler ) return;
        if ( eventVO.type === event.type || eventVO.type === Event.ANY ) {
            eventVO.binded ? eventVO.binded( event ) : eventVO.handler( event );
        }
    }

}

class EventVO {

    public type: string = Event.ANY;
    public handler: Function | undefined;
    public context?: IEventDispatcher;
    public binded?: Function;
    public useCapture: boolean = false;
    public priority: number = 0;

    constructor( data: IEventData ) {

        this.parse( data );

    }

    public parse( data: IEventData ) {

        this.type = data.type;
        this.handler = data.handler;
        this.context = data.context;
        this.binded = data.binded;
        this.useCapture = data.useCapture || false;
        this.priority = data.priority || 0;

    }

}

