import getEnvVars from './get-env-vars';
import { cleanValue } from './utils';

interface IRunnerParams {
  params: {
    isHeroku?: boolean;
    isAws?: boolean;
    envVars?: Array<string>;
    region?: string;
    addExport: boolean;
    herokuToken?: string;
    herokuAppName?: string;
    providerPaths: Array<string>;
  };
  version: string;
}

const PROVIDERS = {
  aws: ['./providers/aws/secrets-manager', './providers/aws/ssm'],
  heroku: ['./providers/heroku'],
};

const validateInputs = ({ params }: IRunnerParams) => {
  const { isHeroku, isAws, envVars, herokuToken, herokuAppName } = params;

  if (isAws && !envVars) {
    throw new Error('"env-vars" parameter is required for AWS providers');
  }

  if (isHeroku && !herokuToken) {
    throw new Error('"heroku-token" parameter is required for Heroku provider');
  }

  if (isHeroku && !herokuAppName) {
    throw new Error(
      '"heroku-app-name" parameter is required for Heroku provider'
    );
  }
};

const main = async ({ params, version }: IRunnerParams) => {
  validateInputs({ params, version });

  const {
    isHeroku,
    isAws,
    envVars,
    region,
    addExport,
    herokuToken,
    herokuAppName,
    providerPaths,
  } = params;

  const providersToBeUsed = !providerPaths
    ? isAws
      ? PROVIDERS['aws']
      : isHeroku
      ? PROVIDERS['heroku']
      : []
    : [];

  const providers = providersToBeUsed
    .filter(Boolean)
    .map(path => (typeof path === 'function' ? path : require(path).default));

  const print = ([key, value]: Array<any>) => {
    const line = `${addExport ? 'export ' : ''}${key}=${cleanValue(value)}`;

    console.log(line);
  };

  console.log(`# Created with genvv ${version}`);

  if (region) {
    console.log(`# AWS region ${region}`);
  }

  return getEnvVars({
    fileLocation: envVars,
    config: { region, herokuToken, herokuAppName },
    providers,
  }).then(data => {
    Object.entries(data).map(print);

    console.log(`# Done! Generated on ${new Date(Date.now())}`);
  });
};

export default main;
