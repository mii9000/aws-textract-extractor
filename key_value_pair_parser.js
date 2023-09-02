const getKvMap = (blocks) => {
    const keyMap = {};
    const valueMap = {};
    const blockMap = {};

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const blockId = block.Id;
        blockMap[blockId] = block;

        if (block.BlockType === "KEY_VALUE_SET") {
            if (block.EntityTypes.includes("KEY")) {
                keyMap[blockId] = block;
            } else {
                valueMap[blockId] = block;
            }
        }
    }

    return { keyMap, valueMap, blockMap };
};


const findValueBlock = (keyBlock, valueMap) => {
    let valueBlock;

    for (let i = 0; i < keyBlock.Relationships.length; i++) {
        const relationship = keyBlock.Relationships[i];
        if (relationship.Type === "VALUE") {
            for (let j = 0; j < relationship.Ids.length; j++) {
                const valueId = relationship.Ids[j];
                valueBlock = valueMap[valueId];
            }
        }
    }

    return valueBlock;
};


const getText = (result, blocksMap) => {
    let text = "";

    if (result.Relationships) {
        for (let i = 0; i < result.Relationships.length; i++) {
            const relationship = result.Relationships[i];
            if (relationship.Type === "CHILD") {
                for (let j = 0; j < relationship.Ids.length; j++) {
                    const childId = relationship.Ids[j];
                    const word = blocksMap[childId];
                    if (word.BlockType === "WORD") {
                        text += `${word.Text} `;
                    }
                    if (word.BlockType === "SELECTION_ELEMENT" && word.SelectionStatus === "SELECTED") {
                        text += 'X ';
                    }
                }
            }
        }
    }

    return text.trim();
};


const getKvRelationship = (keyMap, valueMap, blockMap) => {
    const kvs = {};

    for (const [, keyBlock] of Object.entries(keyMap)) {
        const valueBlock = findValueBlock(keyBlock, valueMap);
        const key = getText(keyBlock, blockMap);
        const val = getText(valueBlock, blockMap);
        kvs[key] = val;
    }

    return kvs;
};

export default function(blocks) {
	const { keyMap, valueMap, blockMap } = getKvMap(blocks);
    const kvs = getKvRelationship(keyMap, valueMap, blockMap);
	return kvs;
}
