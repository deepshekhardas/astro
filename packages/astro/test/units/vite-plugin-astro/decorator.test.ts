import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';
import { transformWithOxc } from 'vite';

describe('experimental decorators in .astro files', () => {
	it('should transpile decorator syntax with legacy decorator option', async () => {
		// Simulate the compiled Astro output that contains decorator syntax
		const code = `
function myDecorator(target) {
  return target;
}

@myDecorator
class MyClass {
  greeting = "Hello";
}
`;
		const result = await transformWithOxc(code, '/src/pages/index.astro', {
			lang: 'ts',
			decorator: { legacy: true },
		});

		assert.ok(result.code, 'should produce output code');
		assert.ok(
			!result.code.includes('@myDecorator'),
			'should not contain raw @myDecorator syntax in output',
		);
		assert.ok(result.code.includes('MyClass'), 'should still contain the class');
	});

	it('should not modify code without decorators', async () => {
		const code = `
class MyClass {
  greeting = "Hello";
}
`;
		const result = await transformWithOxc(code, '/src/pages/index.astro', {
			lang: 'ts',
			decorator: { legacy: true },
		});

		assert.ok(result.code, 'should produce output code');
		assert.ok(result.code.includes('MyClass'), 'should still contain the class');
	});
});
