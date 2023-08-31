import { Container, interfaces } from "inversify";

export default interface IInjectionContainer {

    containerID: string;

    container: Container;

	isBound( serviceIdentifier: interfaces.ServiceIdentifier<any> ): boolean;

	bind<T>( serviceIdentifier: interfaces.ServiceIdentifier<T> ): interfaces.BindingToSyntax<T>;

	unbind( serviceIdentifier: interfaces.ServiceIdentifier<any> ): void;

	rebind<T>( serviceIdentifier: interfaces.ServiceIdentifier<T> ): interfaces.BindingToSyntax<T>;

    lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;

    lazyInjectNamed: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>, named: string) => (proto: any, key: string) => void;

    lazyInjectTagged: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>, key: string, value: any) => (proto: any, propertyName: string) => void;

    lazyMultiInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
}