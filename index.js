const getKvRelationship = (keyMap, valueMap, blockMap) => {
	const kvs = {};

	for (const [, keyBlock] of Object.entries(keyMap)) {
		const valueBlock = findValueBlock(keyBlock, valueMap);
		const key = getText(keyBlock, blockMap);
		const value = getText(valueBlock, blockMap);
		kvs[key] = value;
	}

	return kvs;
};

const findValueBlock = (keyBlock, valueMap) => {
	let valueBlock;

	for (let i = 0; i < keyBlock.Relationships.length; i++) {
		const relationship = keyBlock.Relationships[i];
		if (relationship.Type === 'VALUE') {
			for (let j = 0; j < relationship.Ids.length; j++) {
				const valueId = relationship.Ids[j];
				valueBlock = valueMap[valueId];
			}
		}
	}

	return valueBlock;
};

const getText = (result, blocksMap) => {
	let text = '';

	if (result.Relationships) {
		for (let i = 0; i < result.Relationships.length; i++) {
			const relationship = result.Relationships[i];
			if (relationship.Type === 'CHILD') {
				for (let j = 0; j < relationship.Ids.length; j++) {
					const childId = relationship.Ids[j];
					const word = blocksMap[childId];
					if (word.BlockType === 'WORD') {
						text += `${word.Text} `;
					}

					if (
						word.BlockType === 'SELECTION_ELEMENT'
						&& word.SelectionStatus === 'SELECTED'
					) {
						text += 'X ';
					}
				}
			}
		}
	}

	return text.trim();
};

const extractTableData = (cellMap, tableMap, blockMap) => {
	// Process Tables
	const tables = [];
	for (const tableId in tableMap) {
		const tableBlock = tableMap[tableId];
		const rows = [];

		for (const relationship of tableBlock.Relationships) {
			if (relationship.Type === 'CHILD') {
				for (const cellId of relationship.Ids) {
					const cellBlock = cellMap[cellId];
					const rowIndex = cellBlock.RowIndex;
					const colIndex = cellBlock.ColumnIndex;
					const text = getText(cellBlock, blockMap);

					// Ensure a list exists for the row, then insert the cell text
					rows[rowIndex] = rows[rowIndex] || [];
					rows[rowIndex][colIndex] = text.trim();
				}
			}
		}

		tables.push(rows);
	}

	return tables;
};

const extract = blocks => {
	const keyMap = {};
	const valueMap = {};
	const blockMap = {};
	const cellMap = {};
	const tableMap = {};

	for (const block of blocks) {
		const blockId = block.Id;
		blockMap[blockId] = block;

		if (block.BlockType === 'KEY_VALUE_SET') {
			block.EntityTypes.includes('KEY')
				? (keyMap[blockId] = block)
				: (valueMap[blockId] = block);
		}

		if (block.BlockType === 'CELL') {
			cellMap[blockId] = block;
		}

		if (block.BlockType === 'TABLE') {
			tableMap[blockId] = block;
		}
	}

	const pairs = getKvRelationship(keyMap, valueMap, blockMap);
	const tables = extractTableData(cellMap, tableMap, blockMap);

	return {pairs, tables};
};

const extractor = {
	extract,
};

export default extractor;
