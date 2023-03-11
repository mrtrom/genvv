import mapFileToKeyValueTuple, {
  KeyValueTuple,
} from './map-env-file-to-key-value-tuple';

type Provider = (params: any) => Promise<Record<string, string>>;

interface IGetEnvVarsParams {
  fileLocation?: string;
  config: any;
  providers: Provider[];
  allowMissing?: boolean;
}

const difference = (a: Array<any>, b: Array<any>) => {
  return a.filter(x => !b.includes(x));
};

const main = async ({
  fileLocation,
  config,
  providers = [],
  allowMissing = false,
}: IGetEnvVarsParams): Promise<KeyValueTuple[]> => {
  const template = fileLocation
    ? await mapFileToKeyValueTuple(fileLocation)
    : undefined;
  const filledTemplateEnvs = (template || []).filter(([key, value]) => !!value);

  const providedEnvs = await Promise.all(
    providers.map(provider => provider({ keys: templateKeys, options: config }))
  );

  if (providedEnvs.find(env => typeof env !== 'object')) {
    throw new Error('providers must return an object');
  }

  const mergedProvidedEnvs = Object.assign({}, ...providedEnvs) as Record<
    string,
    string
  >;

  // merge template tuples with fetched envs but keep the template values when defined
  const result = [
    ...filledTemplateEnvs,
    ...Object.entries(mergedProvidedEnvs).filter(
      ([key]) => !filledTemplateEnvs?.find(([_key, value]) => _key === key)
    ),
  ];

  const templateKeys = template?.map(([key]) => key);
  if (!allowMissing && templateKeys) {
    // get a list of keys that have values
    const filledKeys = result
      .filter(([key, value]) => !!value)
      .map(([key]) => key);

    // get a list of keys missing from the results
    const missingKeys = difference(templateKeys, filledKeys);

    // throw error if not all of the keys have been filled with values
    if (missingKeys.length) {
      throw new Error(
        `Result is missing required values: ${missingKeys.join()}`
      );
    }
  }

  return result;
};

export default main;
