import { PluginSpec } from 'semantic-release';

import { transform } from './transform';

const releaseRules = [
  { release: 'patch', type: 'build' },
  { release: 'patch', type: 'ci' },
  { release: 'patch', type: 'chore' },
  { release: 'patch', type: 'docs' },
  { release: 'patch', type: 'refactor' },
  { release: 'patch', type: 'style' },
  { release: 'patch', type: 'test' },
];


const parserOptions = {
  mergeCorrespondence: ['id', 'source'],
  /* eslint-disable prefer-named-capture-group */
  /* eslint-disable require-unicode-regexp */
  mergePattern: /^Merge pull request #(\d+) from (.*)$/,
  /* eslint-enable prefer-named-capture-group */
  /* eslint-enable require-unicode-regexp */
};

const generateExecPlugin = (
  command: string,
): [string, { prepareCmd: string }] | [] => {
  return ['@semantic-release/exec', { prepareCmd: command }];
};

export const generatePlugins = (options: {
  publishToNpm: boolean;
  scriptPath: string | undefined;
}): PluginSpec[] => {
  return [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOptions,
        releaseRules,
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        /* eslint-disable unicorn/prevent-abbreviations */
        writerOpts: {
          transform
        }
        /* eslint-enable unicorn/prevent-abbreviations */
      }
    ],
    '@semantic-release/changelog',
    generateExecPlugin('npx prettier --write CHANGELOG.md'),
    ...(options.scriptPath === undefined
      ? []
      : [generateExecPlugin(options.scriptPath)]),
    ...(options.publishToNpm === false ? [] : ['@semantic-release/npm']),
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
