import { SSM } from 'aws-sdk';

interface ISSMConfiguration {
  keys: Array<string>;
  options: Record<string, any>;
}

const BATCH_SIZE = 10;
const awsNsRegEx = /^aws/i;

const main = async ({ keys, options }: ISSMConfiguration) => {
  const { region } = options;

  const ps = new SSM({ apiVersion: '2014-11-06', region });
  const getParametersBatch = (keys: Array<string>) => {
    return new Promise(resolve => {
      ps.getParameters({ Names: keys, WithDecryption: true }, (err, params) => {
        if (err) throw err;
        if (!params?.Parameters) {
          return resolve({});
        }

        const data = params.Parameters.reduce((result, param) => {
          if (!param?.Name) return result;
          result[param.Name] = param.Value;
          return result;
        }, {} as Record<string, any>);

        resolve(data);
      });
    });
  };

  // Build groups in batches of 10 (API limitation)
  const keyBatches = keys
    .filter(key => !awsNsRegEx.test(key))
    .map((_, i, all) => all.slice(BATCH_SIZE * i, BATCH_SIZE * i + BATCH_SIZE))
    .filter(x => x.length);

  return Promise.all(keyBatches.map(getParametersBatch)).then(datas => {
    return Object.assign({}, ...datas);
  });
};

export default main;
