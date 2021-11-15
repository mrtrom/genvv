import mapFileToObject from '../src/map-env-file-to-object';
import { constants } from './fixtures/simple';

describe('[mapFileToObject]', () => {
  it('handles missing source env file', async () => {
    try {
      await mapFileToObject('./i-dont-exist.env');
    } catch (e: any) {
      expect(e?.message).toBe('Source env file not found: ./i-dont-exist.env');
    }
  });

  it('correcly maps env file', async () => {
    const data = await mapFileToObject('./test/fixtures/simple.env');
    expect(data).toEqual(constants);
  });
});
