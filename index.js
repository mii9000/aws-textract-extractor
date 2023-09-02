import kv_parser from './key_value_pair_parser.js'

export const getKeyValuePairs = blocks => {
	const result = kv_parser(blocks)
	return result;
}
