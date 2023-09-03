# aws-textract-extractor

> Utility package to help parse AWS Textract response

## Install

```sh
npm install aws-textract-extractor
```

## Usage

```js
import extractor from 'aws-textract-extractor';
const response = extractor.extract(blocks)
```

## API

### extract(blocks)

#### input

Type: `Block[]`

Blocks response from AWS Textract commands.

#### returns

Type: `object`

An object with extracted forms data as key-value pair and tables data
```
{
 "pairs": { },
 "tables": [ ]
}
```
