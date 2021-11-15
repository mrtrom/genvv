import { readFile, existsSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { isNotCommentLine, parseLineAsKeyValue } from './utils';

const readFileAsync = promisify(readFile);

const main = async (fileLocation: any) => {
  // console.log(path.join(__dirname, fileLocation));
  if (!existsSync(fileLocation)) {
    throw new Error(`Source env file not found: ${fileLocation}`);
  }

  const data = await readFileAsync(fileLocation);

  return data
    .toString()
    .split('\n')
    .filter(isNotCommentLine)
    .reduce((template, line) => {
      const [key, value] = parseLineAsKeyValue(line);

      if (!key) {
        return template;
      }

      template[key] = value;

      return template;
    }, {} as Record<string, any>);
};

export default main;
