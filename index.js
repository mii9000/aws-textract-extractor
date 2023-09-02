import keyValueParser from './key-value-pair-parser.js';

export const getKeyValuePairs = blocks => {
	const result = keyValueParser(blocks);
	return result;
};
