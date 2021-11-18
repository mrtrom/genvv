import sinon from 'sinon';
import getEnvVars from '../src/get-env-vars';
import { constants } from './fixtures/simple';

describe('[getEnvVars]', () => {
  it('calls all given value providers', async () => {
    const provider = sinon.spy(() =>
      Promise.resolve({ AVAILABLE_VAR: 'provider1', OTHER_VAR: 12 })
    );

    const config = { region: 'foo', isAws: true };
    await getEnvVars({
      fileLocation: './test/fixtures/simple.env',
      config,
      providers: [provider],
    });

    expect(provider.callCount).toBe(1);
    expect(provider.args).toEqual([
      [{ keys: Object.keys(constants), options: config }],
    ]);
  });

  it('fails hard when request value is not returned provider', async () => {
    try {
      const provider = () =>
        Promise.resolve({ OTHER_VAR: 'lose', BADLY_SPACED_VAR: 'win' });

      const config = { region: 'foo', isAws: true };
      await getEnvVars({
        fileLocation: './test/fixtures/simple.env',
        config,
        providers: [provider],
      });
    } catch (e) {
      expect(e).not.toBeFalsy();
    }
  });

  it('merges results form each provider in order', async () => {
    const provider1 = () =>
      Promise.resolve({ OTHER_VAR: 'provider1', AVAILABLE_VAR: 'provider1' });
    const provider2 = () =>
      Promise.resolve({
        OTHER_VAR: 'provider2',
        BADLY_SPACED_VAR: 'provider2',
      });

    const config = { region: 'foo', isAws: true };
    const data = await getEnvVars({
      fileLocation: './test/fixtures/simple.env',
      config,
      providers: [provider1, provider2],
    });
    expect(data).toEqual({
      OTHER_VAR: 'provider1',
      AVAILABLE_VAR: 'provider1',
      BADLY_SPACED_VAR: 'provider2',
      PREFILLED_VAR: 42,
    });
  });
});
