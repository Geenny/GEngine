type ID = string | number;

type StateName = string;

type ObjectListNumber = { [ name: string]: number };

type ObjectListString = { [ name: string]: string };

type ObjectListAny = { [ name: string]: any };

type ObjectListPrimitive = { [ name: string]: string | number | boolean };

type RecieveMethods = { onStart?: Function, onLoad?: Function, onError?: Function };

export { ID, StateName, ObjectListNumber, ObjectListString, ObjectListAny, ObjectListPrimitive, RecieveMethods };