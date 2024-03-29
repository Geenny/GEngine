type ID = string | number;

type NAME = string;

type StateName = string;

type ObjectListNumber = { [ name: string]: number };

type ObjectListString = { [ name: string]: string };

type ObjectListAny = { [ name: string]: any };

type ObjectListPrimitive = { [ name: string]: string | number | boolean };

type ObjectListMethod = { [ name: string]: Function };

type RecieveMethods = { onStart?: Function, onLoad?: Function, onError?: Function };

export {
	ID,
	NAME,
	StateName,
	ObjectListNumber,
	ObjectListString,
	ObjectListAny,
	ObjectListPrimitive,
	ObjectListMethod,
	RecieveMethods
};