import { interfaces } from "inversify";

export default interface IInjectionContainerBinds {

	isBound( serviceIdentifier: interfaces.ServiceIdentifier<any> ): boolean;

	bind<T>( serviceIdentifier: interfaces.ServiceIdentifier<T> ): interfaces.BindingToSyntax<T>;

	unbind( serviceIdentifier: interfaces.ServiceIdentifier<any> ): void;

	rebind<T>( serviceIdentifier: interfaces.ServiceIdentifier<T> ): interfaces.BindingToSyntax<T>;

}