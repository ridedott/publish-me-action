import * as core from '@actions/core';

import { Flags, handleBranchFlag, handleDryRunFlag } from './handlers';

/*
 * Setup and teardown
 */

const getInputSpy = jest.spyOn(core, 'getInput');

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
    'it should return proper branch flag object',
    (input: { branch: string; expected: { branch?: string } }): void => {
      expect.assertions(2);

      getInputSpy.mockImplementationOnce((): string => input.branch);

      expect(handleBranchFlag()).toMatchObject(input.expected);
      expect(getInputSpy).toHaveBeenCalledWith(Flags.branch);
    },
  );

  it.each([
    { dryRun: 'true', expected: { dryRun: true } },
    { dryRun: 'false', expected: { dryRun: false } },
    { dryRun: '', expected: { dryRun: false } },
  ])(
    'it should return proper dryRun flag object',
    (input: { dryRun: string; expected: { dryRun: boolean } }): void => {
      expect.assertions(2);

      getInputSpy.mockImplementationOnce((): string => input.dryRun);

      expect(handleDryRunFlag()).toMatchObject(input.expected);
      expect(getInputSpy).toHaveBeenCalledWith(Flags.dryRun);
    },
  );
});
