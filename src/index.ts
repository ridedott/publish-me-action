// import { setFailed } from '@actions/core';
// import { env as environment } from 'process';
// import * as semanticRelease from 'semantic-release';
//
// import {
//   generatePlugins,
//   parserOptions,
//   releaseRules,
//   transform,
// } from './config';
// import {
//   handleBranchFlag,
//   handleDebugFlag,
//   handleDryRunFlag,
//   handleScriptPathFlag,
// } from './optionsHandlers';
// import { Commands, reportResults, runTask } from './tasks';
//
// if (handleDebugFlag() === true) {
//   /* eslint-disable @typescript-eslint/no-require-imports */
//   /* eslint-disable-next-line global-require */
//   require('debug').enable('semantic-release:*');
//   /* eslint-enable @typescript-eslint/no-require-imports */
// }
//
// const main = async (): Promise<void> => {
//   await Promise.all([
//     runTask(Commands.PreInstallPlugins),
//     runTask(Commands.RemoveNpmrc),
//   ]);
//
//   const result = await semanticRelease({
//     /* eslint-disable unicorn/prevent-abbreviations */
//     ci: false,
//     ...handleBranchFlag(),
//     ...handleDryRunFlag(),
//     parserOpts: parserOptions,
//     plugins: generatePlugins({
//       publishToNpm: environment.NPM_TOKEN !== undefined,
//       scriptPath: await handleScriptPathFlag(),
//     }),
//     releaseRules,
//     writerOpts: { transform },
//     /* eslint-enable unicorn/prevent-abbreviations */
//   });
//
//   await reportResults(result);
// };
//
// main().catch((error: Error): void => {
//   setFailed(`An unexpected error occurred: ${error}, ${error.stack}.`);
// });

import { getInput, setFailed } from '@actions/core';
import * as semanticRelease from 'semantic-release';

enum ActionParameters {
  branch = 'branch',
  debug = 'debug',
  dryRun = 'dry-run',
}

const commitAnalyzerParserOptions = {
  mergeCorrespondence: ['id', 'source'],
  /* eslint-disable prefer-named-capture-group */
  /* eslint-disable require-unicode-regexp */
  mergePattern: /^Merge pull request #(\d+) from (.*)$/,
  /* eslint-enable prefer-named-capture-group */
  /* eslint-enable require-unicode-regexp */
};

const commitAnalyzerReleaseRules = [
  { release: 'patch', type: 'build' },
  { release: 'patch', type: 'ci' },
  { release: 'patch', type: 'chore' },
  { release: 'patch', type: 'docs' },
  { release: 'patch', type: 'refactor' },
  { release: 'patch', type: 'style' },
  { release: 'patch', type: 'test' },
];

const main = async (): Promise<void> => {
  const branch: string = getInput(ActionParameters.branch);
  const isDryRun: boolean = getInput(ActionParameters.dryRun) === 'true';
  const isDebug: boolean = getInput(ActionParameters.debug) === 'true';

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    branch, isDebug, isDryRun
  }));

  await semanticRelease({
    ci: true,
    plugins: [
      [
        '@semantic-release/commit-analyzer',
        {
          // eslint-disable-next-line unicorn/prevent-abbreviations
          parserOpts: commitAnalyzerParserOptions,
          releaseRules: commitAnalyzerReleaseRules,
        },
      ]
    ]
  });
};

main()
  .catch((error: Error): void => {
    setFailed(JSON.stringify(error));
  });
