'use strict';

const t = require('libtap');

const getPackageType = require('.');
const cache = require('./cache.cjs');

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

t.test('promise cache', async t => {
	// This test hits the path where a value is not cached but a promise is
	const p1 = getPackageType('./index.cjs');
	const p2 = getPackageType('./index.mjs');
	t.same(await p1, await p2);
	t.same(await p1, 'module');
});

t.test('check directories', async t => {
	for (const [directory, type] of Object.entries(checks)) {
		t.same(await getPackageType(directory), type, `async: ${directory} type is ${type}`);
	}

	cache.clear();

	for (const [directory, type] of Object.entries(checks)) {
		t.same(getPackageType.sync(directory), type, `sync: ${directory} type is ${type}`);
	}
});
