import { SecretsManager } from 'aws-sdk';

interface ISMConfiguration {
  keys: Array<string>;
  options: Record<string, any>;
}

const main = async ({ keys, options }: ISMConfiguration) => {
  const { region } = options;

  const sm = new SecretsManager({ apiVersion: '2017-10-17', region });
  const getSecret = (key: string) => {
    return new Promise(resolve => {
      sm.getSecretValue({ SecretId: key }, (err, secret) => {
        if (err && err.statusCode === 400) return resolve({});
        if (err) throw err;

        if (!secret?.SecretString) {
          return resolve({});
        }

        resolve({ [key]: secret.SecretString });
      });
    });
  };

  const data = await Promise.all(keys.map(getSecret));
  return Object.assign({}, ...data);
};

export default main;
