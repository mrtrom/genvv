const COMMENT_TOKEN = '#';

export const isNotCommentLine = (line: string) => {
  return line[0] !== COMMENT_TOKEN;
};

export const cleanEmptyString = (value: string) => {
  return value === '""' ? '' : value;
};

export const cleanKey = (key: string) => {
  return key?.replace('export', '');
};

export const parseLineAsKeyValue = (
  line: string
): [string, string | number] => {
  const [key, value] =
    line
      .split('=')
      .filter(Boolean)
      .map(p => p.replace(/\s+/g, '')) || [];

  return [cleanKey(key), !isNaN(+value) ? +value : cleanEmptyString(value)];
};

export const cleanValue = (value: string | number) => {
  return typeof value === 'string'
    ? `"${value.replace(/\\([\s\S])|(")/g, '\\$1$2')}"`
    : value;
};
