const COMMENT_TOKEN = '#';

export const isNotCommentLine = (line: string) => {
  return line[0] !== COMMENT_TOKEN;
};

export const parseLineAsKeyValue = (
  line: string
): [string, string | number] => {
  const [key, value] =
    line
      .split('=')
      .filter(Boolean)
      .map(p => p.replace(/\s+/g, '')) || [];

  return [key, !isNaN(+value) ? +value : value];
};

export const cleanValue = (value: string | number) => {
  return value === 'string'
    ? `"${value.replace(/\\([\s\S])|(")/g, '\\$1$2')}"`
    : value;
};
