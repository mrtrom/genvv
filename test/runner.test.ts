import sinon from 'sinon';
import runner from '../src/runner';

describe('[runner]', () => {
  test('handles missing args', async () => {
    try {
      await runner({ params: {} as any, version: '1' });
    } catch (e: any) {
      expect(e.message).toBe('"env-vars" parameter is required');
    }
  });

  test('prints populated key value with export', async () => {
    const log = sinon.spy();
    const argv = {
      envVars: './test/fixtures/simple.env',
      addExport: true,
      providerPaths: ['./providers/echo'],
      log,
    };
    await runner({ params: argv as any, version: '1' });
    expect(log.args.slice(2, 6)).toEqual([
      ['export AVAILABLE_VAR="AVAILABLE_VAR"'],
      ['export OTHER_VAR="OTHER_VAR"'],
      ['export PREFILLED_VAR="PREFILLED_VAR"'],
      ['export BADLY_SPACED_VAR="BADLY_SPACED_VAR"'],
    ]);
  });

  // test('prints populated key value without export', async () => {
  //   const log = sinon.spy();
  //   const argv = {
  //     envVars: './test/fixtures/simple.env',
  //     addExport: false,
  //     providerPaths: ['./providers/echo.js'],
  //     log,
  //   };
  //   await runner({ params: argv as any, version: '1' });
  //   expect(log.args.slice(2, 6)).toEqual([
  //     ['AVAILABLE_VAR="AVAILABLE_VAR"'],
  //     ['OTHER_VAR="OTHER_VAR"'],
  //     ['PREFILLED_VAR="PREFILLED_VAR"'],
  //     ['BADLY_SPACED_VAR="BADLY_SPACED_VAR"'],
  //   ]);
  // });

  // test('handles spaces and quotes in values', async () => {
  //   const log = sinon.spy();
  //   const testVars = {
  //     UNQUOTED_VAR: 'Unquoted words in a sentence',
  //     QUOTED_VAR: '"Quoted words n stuff"',
  //     MID_QUOTED_VAR: 'my quotes "are here" for some reason',
  //     BAD_QUOTED_VAR: 'my \'quote " are a " mess"',
  //   };
  //   const argv = {
  //     envVars: testVars,
  //     addExport: false,
  //     providerPaths: [() => testVars],
  //     log,
  //   };
  //   await runner({ params: argv as any, version: '1' });
  //   expect(log.args.slice(2, 6)).toEqual([
  //     ['UNQUOTED_VAR="Unquoted words in a sentence"'],
  //     [String.raw`QUOTED_VAR="\"Quoted words n stuff\""`],
  //     [String.raw`MID_QUOTED_VAR="my quotes \"are here\" for some reason"`],
  //     [String.raw`BAD_QUOTED_VAR="my 'quote \" are a \" mess\""`],
  //   ]);
  // });

  // test('handles numbers as values', async () => {
  //   const log = sinon.spy();
  //   const testVars = {
  //     NUMBER_VAR: 123,
  //     FLOAT_VAR: 123.456,
  //   };
  //   const argv = {
  //     envVars: testVars,
  //     addExport: false,
  //     providerPaths: [() => testVars],
  //     log,
  //   };
  //   await runner({ params: argv as any, version: '1' });
  //   expect(log.args.slice(2, 4)).toEqual([
  //     ['NUMBER_VAR=123'],
  //     ['FLOAT_VAR=123.456'],
  //   ]);
  // });

  // test('prints program headers', async () => {
  //   const log = sinon.spy();
  //   const argv = {
  //     envVars: './test/fixtures/simple.env',
  //     addExport: true,
  //     providerPaths: ['./providers/echo.js'],
  //     log,
  //   };
  //   await runner({ params: argv as any, version: '1' });
  //   expect(log.args.slice(0, 2)).toEqual([
  //     ['# Created with Strongbox 1'],
  //     ['# AWS region us-east-1'],
  //   ]);
  // });

  // test('prints program footers', async () => {
  //   const log = sinon.spy();
  //   const argv = {
  //     envVars: './test/fixtures/simple.env',
  //     addExport: true,
  //     providerPaths: ['./providers/echo.js'],
  //     log,
  //   };
  //   await runner({ params: argv as any, version: '1' });
  //   const footer = log.args.slice(-1)[0][0];
  //   expect(footer.indexOf('# Done! Generated on')).toBe(0);
  // });
});
