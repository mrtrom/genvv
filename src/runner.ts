import getEnvVars from './get-env-vars';
import { cleanValue } from './utils';

interface IRunnerParams {
  params: {
    envVars: Array<string>;
    region: string;
    addExport: boolean;
    providerPaths: Array<string>;
  };
  version: string;
}

const DEFAULT_VALUE_PROVIDERS = [
  './providers/aws/secrets-manager',
  './providers/aws/ssm',
];

const main = async ({ params, version }: IRunnerParams) => {
  const {
    envVars,
    region = 'us-east-1',
    addExport,
    providerPaths = DEFAULT_VALUE_PROVIDERS,
  } = params;

  if (!envVars) {
    throw new Error('"env-vars" parameter is required');
  }

  const providers = providerPaths
    .filter(Boolean)
    .map(path => (typeof path === 'function' ? path : require(path)));

  const print = ([key, value]: Array<any>) => {
    const line = `${addExport ?? 'export '}${key}=${cleanValue(value)}`;

    console.log(line);
  };

  console.log(`# Created with genvv ${version}`);
  console.log(`# AWS region ${region}`);

  return getEnvVars({
    fileLocation: envVars,
    config: { region },
    providers,
  }).then(data => {
    Object.entries(data).map(print);

    console.log(`# Done! Generated on ${new Date(Date.now())}`);
  });
};

export default main;
