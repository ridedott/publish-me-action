import { setFailed } from '@actions/core';
import { env as environment } from 'process';
import * as semanticRelease from 'semantic-release';

import { Commands, reportResults, runTask } from './tasks';
import {
  generatePlugins,
  handleBranchFlag,
  handleDebugFlag,
  handleDryRunFlag,
  handleScriptPathFlag,
} from './util';

if (handleDebugFlag() === true) {
  /* eslint-disable @typescript-eslint/no-require-imports */
  /* eslint-disable-next-line global-require */
  require('debug').enable('semantic-release:*');
  /* eslint-enable @typescript-eslint/no-require-imports */
}

const main = async (): Promise<void> => {
  await Promise.all([
    runTask(Commands.PreInstallPlugins),
    runTask(Commands.RemoveNpmrc),
  ]);

  const result = await semanticRelease({
    ci: false,
    ...handleBranchFlag(),
    ...handleDryRunFlag(),
    plugins: generatePlugins({
      publishToNpm: environment.NPM_TOKEN !== undefined,
      scriptPath: await handleScriptPathFlag(),
    }),
  });

  await reportResults(result);
};

main().catch((error: Error): void => {
  setFailed(`An unexpected error occurred: ${error}, ${error.stack}.`);
});
