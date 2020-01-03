import * as core from '@actions/core';

import * as handlers from './handlers';

/*
 * Setup and teardown
 */

const getInputSpy = jest.spyOn(core, 'getInput');
const fileExistsAsyncSpy = jest.spyOn(handlers, 'existsAsync');

afterEach((): void => {
  jest.clearAllMocks();
});

/*
 * Tests
 */

describe('handlers', (): void => {
  it.each([
    { branch: 'develop', expected: { branch: 'develop' } },
    { branch: 'master', expected: { branch: 'master' } },
    { branch: '', expected: {} },
  ])(
    'returns a proper branch flag object',
    (input: { branch: string; expected: { branch?: string } }): void => {
      expect.assertions(2);

      getInputSpy.mockImplementationOnce((): string => input.branch);

      expect(handlers.handleBranchFlag()).toMatchObject(input.expected);
      expect(getInputSpy).toHaveBeenCalledWith(handlers.Flags.branch);
    },
  );

  it.each([
    { dryRun: 'true', expected: { dryRun: true } },
    { dryRun: 'false', expected: { dryRun: false } },
    { dryRun: '', expected: { dryRun: false } },
  ])(
    'returns a proper dryRun flag object',
    (input: { dryRun: string; expected: { dryRun: boolean } }): void => {
      expect.assertions(2);

      getInputSpy.mockImplementationOnce((): string => input.dryRun);

      expect(handlers.handleDryRunFlag()).toMatchObject(input.expected);
      expect(getInputSpy).toHaveBeenCalledWith(handlers.Flags.dryRun);
    },
  );

  it.each([
    { debug: 'true', expected: true },
    { debug: 'false', expected: false },
    { debug: '', expected: false },
  ])(
    'returns a proper debug flag object',
    (input: { debug: string; expected: boolean }): void => {
      expect.assertions(2);

      getInputSpy.mockImplementationOnce((): string => input.debug);

      expect(handlers.handleDebugFlag()).toBe(input.expected);
      expect(getInputSpy).toHaveBeenCalledWith(handlers.Flags.debug);
    },
  );

  it('returns a path if it exists', async (): Promise<void> => {
    expect.assertions(3);

    const fakePath = './scripts/test.sh';
    getInputSpy.mockImplementationOnce((): string => fakePath);
    fileExistsAsyncSpy.mockResolvedValue(true);

    const script = await handlers.handleScriptPathFlag();

    expect(script).toStrictEqual(fakePath);
    expect(getInputSpy).toHaveBeenCalledWith(handlers.Flags.scriptPath);
    expect(fileExistsAsyncSpy).toHaveBeenCalledTimes(1);
  });

  it('returns undefined if a path is empty', async (): Promise<void> => {
    expect.assertions(2);

    getInputSpy.mockImplementationOnce((): string => '');

    const script = await handlers.handleScriptPathFlag();

    expect(script).toBeUndefined();
    expect(getInputSpy).toHaveBeenCalledWith(handlers.Flags.scriptPath);
  });

  it('throws an error if path is wrong', async (): Promise<void> => {
    expect.assertions(3);

    const fakePath = './scripts/test.sh';
    getInputSpy.mockImplementationOnce((): string => fakePath);
    fileExistsAsyncSpy.mockResolvedValue(false);

    try {
      await handlers.handleScriptPathFlag();
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: The file specified in SCRIPT_PATH does not exist.]`,
      );
    }

    expect(getInputSpy).toHaveBeenCalledWith(handlers.Flags.scriptPath);
    expect(fileExistsAsyncSpy).toHaveBeenCalledTimes(1);
  });
});
