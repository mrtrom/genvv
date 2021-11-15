const main = (keys: Array<string>) => {
  return keys.reduce((result, key) => {
    result[key] = key;

    return result;
  }, {} as Record<string, string | number>);
};

export default main;
