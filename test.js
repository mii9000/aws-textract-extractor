import {readFileSync} from 'node:fs';
import test from 'ava';
import extractor from './index.js';

// Arrange
const contents = readFileSync('test-block-response.json', 'utf8');
const blocks = JSON.parse(contents);

test('key-value pairs', t => {
	// Act
	const result = extractor.extract(blocks).pairs;

	// Assert
	t.assert(result['INVOICE NUMBER:'] === 'ABC123');
	t.assert(result['DATE OF ISSUE:'] === '01/07/2023');
	t.assert(result.SUBTOTAL === '$17.99');
	t.assert(result.DISCOUNT === '$2.87');
	t.assert(result['TAX RATE'] === '5%');
	t.assert(result.TAX === '$0.76');
	t.assert(result['INVOICE TOTAL'] === '$14.36');
});

test('table', t => {
	// Act
	const result = extractor.extract(blocks).tables;

	// Assert
	t.assert(result.length === 1, 'Should be only 1 table');
	t.assert(result[0].length > 12, 'Should have at least 12 rows');
	const targetRow = result[0].find(row => row && row.includes('Trouser'));
	t.assert(targetRow && targetRow.includes('$2.00'), 'Should match unit price');
	t.assert(targetRow && targetRow.includes('$6.00'), 'Should match total price');
	t.assert(targetRow && targetRow.includes('3'), 'Should match quantity');
});
