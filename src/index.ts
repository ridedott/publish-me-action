// Import { setFailed } from '@actions/core';
// Import { env as environment } from 'process';
// Import * as semanticRelease from 'semantic-release';
//
// Import {
//   GeneratePlugins,
//   ParserOptions,
//   ReleaseRules,
//   Transform,
// } from './config';
// Import {
//   HandleBranchFlag,
//   HandleDebugFlag,
//   HandleDryRunFlag,
//   HandleScriptPathFlag,
// } from './optionsHandlers';
// Import { Commands, reportResults, runTask } from './tasks';
//
// If (handleDebugFlag() === true) {
//   /* eslint-disable @typescript-eslint/no-require-imports */
//   /* eslint-disable-next-line global-require */
//   Require('debug').enable('semantic-release:*');
//   /* eslint-enable @typescript-eslint/no-require-imports */
// }
//
// Const main = async (): Promise<void> => {
//   Await Promise.all([
//     RunTask(Commands.PreInstallPlugins),
//     RunTask(Commands.RemoveNpmrc),
//   ]);
//
//   Const result = await semanticRelease({
//     /* eslint-disable unicorn/prevent-abbreviations */
//     Ci: false,
//     ...handleBranchFlag(),
//     ...handleDryRunFlag(),
//     ParserOpts: parserOptions,
//     Plugins: generatePlugins({
//       PublishToNpm: environment.NPM_TOKEN !== undefined,
//       ScriptPath: await handleScriptPathFlag(),
//     }),
//     ReleaseRules,
//     WriterOpts: { transform },
//     /* eslint-enable unicorn/prevent-abbreviations */
//   });
//
//   Await reportResults(result);
// };
//
// Main().catch((error: Error): void => {
//   SetFailed(`An unexpected error occurred: ${error}, ${error.stack}.`);
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
  console.log(
    JSON.stringify({
      branch,
      isDebug,
      isDryRun,
    }),
  );

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
      ],
    ],
  });
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
