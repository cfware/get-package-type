'use strict';

const t = require('libtap');

const getPackageType = require('.');

process.chdir(__dirname);

const pathInfo = (directory, type) => ({
	[`${directory}/file.js`]: type,
	[`${directory}/file.cjs`]: type,
	[`${directory}/file.mjs`]: type
});

const checks = {
	...pathInfo('.', 'module'),
	...pathInfo('fixtures', 'module'),
	...pathInfo('fixtures/node_modules', 'commonjs'),
	...pathInfo('fixtures/node_modules/no-type', 'commonjs'),
	...pathInfo('fixtures/node_modules/no-package-json', 'commonjs'),
	...pathInfo('fixtures/node_modules/type-commonjs', 'commonjs'),
	'fixtures/node_modules/type-module': 'commonjs',
	...pathInfo('fixtures/node_modules/type-module', 'module'),
	...pathInfo('fixtures/node_modules/type-module/subdir', 'commonjs'),
	...pathInfo('', 'commonjs')
};

t.test('check directories', async t => {
	for (const [directory, type] of Object.entries(checks)) {
		t.same(await getPackageType(directory), type, `${directory} type is ${type}`);
	}
});
