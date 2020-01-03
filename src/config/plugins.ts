import { PluginSpec } from 'semantic-release';

import { releaseRules } from './releaseRules';

const generateExecPlugin = (
  command: string,
): [string, { prepareCmd: string }] | [] => {
  return ['@semantic-release/exec', { prepareCmd: command }];
};

export const generatePlugins = (options: {
  scriptPath: string | undefined;
}): PluginSpec[] => {
  return [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules,
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    generateExecPlugin('npx prettier --write CHANGELOG.md'),
    ...(options.scriptPath === undefined
      ? []
      : [generateExecPlugin(options.scriptPath)]),
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['dist', 'package.json', 'package-lock.json', 'CHANGELOG.md'],
        // eslint-disable-next-line no-template-curly-in-string
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    [
      '@semantic-release/github',
      {
        failComment: false,
        releasedLabels: false,
        successComment: false,
      },
    ],
  ] as PluginSpec[];
};
