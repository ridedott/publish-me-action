"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const semanticRelease = require("semantic-release");
var ActionParameters;
(function (ActionParameters) {
    ActionParameters["branch"] = "branch";
    ActionParameters["debug"] = "debug";
    ActionParameters["dryRun"] = "dry-run";
})(ActionParameters || (ActionParameters = {}));
const commitAnalyzerParserOptions = {
    mergeCorrespondence: ['id', 'source'],
    /* eslint-disable prefer-named-capture-group */
    /* eslint-disable require-unicode-regexp */
    mergePattern: /^Merge pull request #(\d+) from (.*)$/,
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
const branch = core_1.getInput(ActionParameters.branch);
const isDryRun = core_1.getInput(ActionParameters.dryRun) === 'true';
const isDebug = core_1.getInput(ActionParameters.debug) === 'true';
// eslint-disable-next-line no-console
console.log(JSON.stringify({
    branch,
    isDebug,
    isDryRun,
}), process.cwd());
// eslint-disable-next-line no-console,no-process-env
console.log(process.env);
const main = async () => {
    await semanticRelease({
        ci: false,
        plugins: [
            [
                '@semantic-release/commit-analyzer',
                {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    parserOpts: commitAnalyzerParserOptions,
                    releaseRules: commitAnalyzerReleaseRules,
                },
            ]
        ],
    }, {
        cwd: '../../misc/semantic-release',
    });
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map