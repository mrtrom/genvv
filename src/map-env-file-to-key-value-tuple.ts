import { readFile, existsSync } from 'fs';
import { promisify } from 'util';
import { isNotCommentLine, parseLineAsKeyValue } from './utils';

export type KeyValueTuple = [string, string | number];

const readFileAsync = promisify(readFile);

const main = async (fileLocation: any) => {
  if (!existsSync(fileLocation)) {
    throw new Error(`Source env file not found: ${fileLocation}`);
  }

  const data = await readFileAsync(fileLocation);

  return data
    .toString()
    .split('\n')
    .filter(isNotCommentLine)
    .map(line => parseLineAsKeyValue(line))
    .filter(([key]) => !!key) as KeyValueTuple[];
};

export default main;
