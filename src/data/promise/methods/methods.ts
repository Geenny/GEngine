import { PromiseStruct } from "../PromiseStruct";

const promiseStructGet = ( target?: any ): PromiseStruct => {
	const methods: any = {}; 
	const promise = new Promise( ( resolve, reject ) => {
		methods.resolve = resolve;
		methods.reject = reject;
	} );
	return { resolve: methods.resolve, reject: methods.reject, target, promise };
};

export { promiseStructGet };