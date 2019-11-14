import { PluginSpec } from 'semantic-release';

import { releaseRules } from './releaseRules';

export const plugins = [
  [
    '@semantic-release/commit-analyzer',
    {
      releaseRules,
    },
  ],
  '@semantic-release/release-notes-generator',
  '@semantic-release/changelog',
  ['@semantic-release/exec', { generateNotes: `./scripts/formatChangelog.sh` }],
  '@semantic-release/npm',
  [
    '@semantic-release/git',
    {
      assets: ['dist', 'package.json', 'package-lock.json', 'CHANGELOG.md'],
      // eslint-disable-next-line no-template-curly-in-string
      message: 'chore(release): ${nextRelease.version}',
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
