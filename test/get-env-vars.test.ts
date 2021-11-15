import sinon from 'sinon';
import getEnvVars from '../src/get-env-vars';
import { constants } from './fixtures/simple';

describe('[getEnvVars]', () => {
  it('calls all given value providers', async () => {
    const vp = sinon.spy(() =>
      Promise.resolve({ AVAILABLE_VAR: 'vp1', OTHER_VAR: 12 })
    );

    const config = { region: 'neverland' };
    await getEnvVars({
      fileLocation: './test/fixtures/simple.env',
      config,
      providers: [vp],
    });

    expect(vp.callCount).toBe(1);
    expect(vp.args).toEqual([[Object.keys(constants), config]]);
  });

  it('fails hard when request value is not returned provider', async () => {
    try {
      const vp1 = () =>
        Promise.resolve({ OTHER_VAR: 'lose', BADLY_SPACED_VAR: 'win' });

      const config = { region: 'neverland' };
      await getEnvVars({
        fileLocation: './test/fixtures/simple.env',
        config,
        providers: [vp1],
      });
    } catch (e) {
      expect(e).not.toBeFalsy();
    }
  });

  it('merges results form each provider in order', async () => {
    const vp1 = () =>
      Promise.resolve({ OTHER_VAR: 'vp1', AVAILABLE_VAR: 'vp1' });
    const vp2 = () =>
      Promise.resolve({ OTHER_VAR: 'vp2', BADLY_SPACED_VAR: 'vp2' });

    const config = { region: 'neverland' };
    const data = await getEnvVars({
      fileLocation: './test/fixtures/simple.env',
      config,
      providers: [vp1, vp2],
    });
    expect(data).toEqual({
      OTHER_VAR: 'vp1',
      AVAILABLE_VAR: 'vp1',
      BADLY_SPACED_VAR: 'vp2',
      PREFILLED_VAR: 42,
    });
  });
});
