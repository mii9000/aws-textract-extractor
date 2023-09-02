# aws-textract-parser

> Utility package to help parse AWS Textract reponse

## Install

```sh
npm install aws-textract-parser
```

## Usage

```js
import { <exported functions> } from 'aws-textract-parser';
```

## API

### getKeyValuePairs(blocks)

#### input

Type: `Block[]`

Blocks response from AWS Textract commands.

#### returns

Type: `object`

An object with extracted forms data as key-value pair
