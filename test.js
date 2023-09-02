import {readFileSync} from 'node:fs';
import test from 'ava';
import {getKeyValuePairs} from './index.js';

test('getKeyValuePairs', t => {
	// Arrange
	const contents = readFileSync('test-block-response.json', 'utf8');
	const blocks = JSON.parse(contents);

	// Act
	const result = getKeyValuePairs(blocks);

	// Assert
	t.assert(result['INVOICE NUMBER:'] === 'ABC123');
	t.assert(result['DATE OF ISSUE:'] === '01/07/2023');
	t.assert(result.SUBTOTAL === '$17.99');
	t.assert(result.DISCOUNT === '$2.87');
	t.assert(result['TAX RATE'] === '5%');
	t.assert(result.TAX === '$0.76');
	t.assert(result['INVOICE TOTAL'] === '$14.36');
});
