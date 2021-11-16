import AWS from 'aws-sdk-mock';
import sinon from 'sinon';
import secretsManager from '../../src/providers/aws/secrets-manager';

describe('[secretsManager]', () => {
  it('handles successful call to secretsManager', async () => {
    const spy = sinon.spy((d, cb) =>
      cb(null, { name: d.SecretId, SecretString: d.SecretId + '-value' })
    );

    AWS.mock('SecretsManager', 'getSecretValue', spy);

    const data = await secretsManager({
      keys: ['KEY1', 'KEY2'],
      options: { region: 'foo' },
    });

    expect(data).toEqual({ KEY1: 'KEY1-value', KEY2: 'KEY2-value' });
    expect(spy.callCount).toBe(2);

    AWS.restore('SecretsManager', 'getSecretValue');
  });

  it('handles erroneus call to secretsManager', async () => {
    const spy = sinon.spy((d, cb) =>
      cb({ err: 'something bad', statusCode: 400 })
    );

    AWS.mock('SecretsManager', 'getSecretValue', spy);

    const data = await secretsManager({
      keys: ['KEY1', 'KEY2'],
      options: { region: 'foo' },
    });

    expect(data).toEqual({});
    expect(spy.callCount).toBe(2);

    AWS.restore('SecretsManager', 'getSecretValue');
  });
});
