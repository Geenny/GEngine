let uid = 0;

function parse(data, meta) {
	const list = [];
	let result = { };

	Object.keys(data).forEach( key => {
		const module = data[key];

		const parentIndex = key.lastIndexOf("\\");
		const parentNames = parentIndex > 0 ? key.slice(0, parentIndex) : "";
		const parentDepth = parentNames ? parentNames.split("\\") : [];

		module.moduleFile = key;
		module.parentNames = parentNames;
		module.parentDepth = parentDepth;

		list.push(module);

		if (parentNames === "") {
			result = module;
			return;
		}

		const parent = moduleFind(list, module);

		if (parent) {
			if (!parent.children) parent.children = [];
			parent.children.push(module);
		}
	});

	moduleSort(result);

	moduleClear(list);

	return Buffer.from( JSON.stringify( result ) );
}

function moduleFind(list, module) {
	const index = module.parentNames.lastIndexOf("\\");
	const candidateNames = index > 0 ? module.parentNames.slice(0, index) : "";
	const candidates = list.filter(cand => cand.parentNames === candidateNames);
	let parent = candidates[0];
	if ( module.to ) {
		const candidatesTo = candidates.filter(cand => cand.moduleFile === module.to);
		if (candidatesTo.length > 0) parent = candidatesTo[0];
	}
	return parent;
}

function moduleSort(source) {
	if (!source.children) return;

	source.children.sort((element1, element2) => {
		const zi1 = element1.zIndex || 0;
		const zi2 = element2.zIndex || 0;
		return zi1 - zi2;
	});

	source.children.forEach(element => moduleSort(element));
}

function moduleClear(list) {
	list.forEach(module => {
		delete module.moduleFile;
		delete module.parentNames;
		delete module.parentDepth;
	});
}

module.exports = parse;