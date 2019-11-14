// cspell:ignore gitignore npmrc

import { setFailed } from '@actions/core';
import * as semanticRelease from 'semantic-release';

import { parserOptions, plugins, releaseRules, transform } from './config';
import { handleBranchFlag, handleDryRunFlag } from './optionsHandlers';
import { Commands, reportResults, runTask } from './tasks';

const main = async (): Promise<void> => {
  const result = await semanticRelease({
    /* eslint-disable unicorn/prevent-abbreviations */
    ci: false,
    ...handleBranchFlag(),
    ...handleDryRunFlag(),
    parserOpts: parserOptions,
    plugins,
    releaseRules,
    writerOpts: { transform },
    /* eslint-enable unicorn/prevent-abbreviations */
  });

  await runTask(Commands.RemoveNpmrc);
  await reportResults(result);
};

main().catch((error: Error): void => {
  setFailed(`An unexpected error occurred: ${error}, ${error.stack}.`);
});
