'use strict';

const path = require('path');
const {promisify} = require('util');
const readFile = promisify(require('fs').readFile);

function isNodeModules(directory) {
	let basename = path.basename(directory);
	/* istanbul ignore next: platform specific branch */
	if (path.sep === '\\') {
		basename = basename.toLowerCase();
	}

	return basename === 'node_modules';
}

async function getType(directory) {
	if (isNodeModules(directory)) {
		return 'commonjs';
	}

	try {
		return JSON.parse(await readFile(path.resolve(directory, 'package.json'))).type || 'commonjs';
	} catch (_) {
	}
}

async function getPackageType(fileOrPath) {
	let directory = path.resolve(path.dirname(fileOrPath));
	let type;
	while (typeof type === 'undefined') {
		type = await getType(directory);
		/* istanbul ignore next: only happens if no package.json is in parent paths */
		if (path.dirname(directory) === directory) {
			return type || 'commonjs';
		}

		directory = path.dirname(directory);
	}

	return type;
}

module.exports = getPackageType;
