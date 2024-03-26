import { InjectionModule } from "core/machines/injection";
import {
	ViewObjectModule,
	ApplicationModule,
	DispatcherModule,
	DependencyModule,
	NetModule,
	PlatformModule,
	UserModule,
	RendererModule,
	SystemModule,
	LoaderManagerModule,
	ResourcesModule,
	LayoutModule,
	SoundModule
} from "core/modules";

export const moduleList: typeof InjectionModule[] = [
	ViewObjectModule,
	ApplicationModule,
	DispatcherModule,
	DependencyModule,
	NetModule,
	SystemModule,
	PlatformModule,
	UserModule,
	RendererModule,
	LoaderManagerModule,
	ResourcesModule,
	LayoutModule,
	SoundModule
];