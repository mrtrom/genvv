import mapFileToObject from './map-env-file-to-object';

interface IGetEnvVarsParams {
  fileLocation: any;
  config: any;
  providers: any;
}

const difference = (a: Array<any>, b: Array<any>) => {
  return a.filter(x => !b.includes(x));
};

const main = async ({
  fileLocation,
  config,
  providers = [],
}: IGetEnvVarsParams) => {
  // const template = await mapFileToObject(fileLocation);
  const template =
    typeof fileLocation === 'string'
      ? await mapFileToObject(fileLocation)
      : Promise.resolve(fileLocation);
  const templateKeys = Object.keys(template);

  const data = await Promise.all(
    providers.map((provider: any) =>
      provider({ keys: templateKeys, options: config })
    )
  );

  if (data.find(entry => typeof entry !== 'object')) {
    throw new Error('providers must return an object');
  }

  // create and array of all data, including template values
  const parts = [{}, template].concat(data.reverse());

  // merge values with latter elements taking precedence
  const result = Object.assign({}, ...parts);

  // get a list of keys that have values
  const filledKeys = Object.keys(result as Record<string, any>).filter(
    (key: string) => result[key as any] !== undefined
  );

  // get a list of keys missing from the results
  const missingKeys = difference(templateKeys, filledKeys);

  // throw error if not all of the keys have been filled with values
  if (missingKeys.length) {
    throw new Error(`Result is missing required values: ${missingKeys.join()}`);
  }

  return result;
};

export default main;
