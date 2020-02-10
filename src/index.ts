import { getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { env as environment } from 'process';
import * as semanticRelease from 'semantic-release';

import { authenticate, Registry } from './util/auth';
import { transform } from './util/transform';

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

const releaseNotesGeneratorWriterOptions = {
  transform
};

const release = async (): Promise<void> => {
  const cwd =
    typeof environment.GITHUB_WORKSPACE === 'string'
      ? environment.GITHUB_WORKSPACE
      : '/github/workspace';

  await semanticRelease(
    {
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
        [
          '@semantic-release/release-notes-generator',
          {
            // eslint-disable-next-line unicorn/prevent-abbreviations
            writerOpts: releaseNotesGeneratorWriterOptions
          }
        ],
        '@semantic-release/changelog',
        [
          '@semantic-release/npm',
          {
            npmPublish: false,
          }
        ],
        [
          '@semantic-release/git',
          {
            assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
            // eslint-disable-next-line no-template-curly-in-string
            message: 'chore(release): ${nextRelease.version} [skip ci]',
          },
        ],
      ]
    },
    {
      cwd
    }
  );
};

const publish = async (registry: Registry, token: string | undefined): Promise<void> => {
  console.log(`Validating input.`);

  if (token === undefined || token.length === 0) {
    return;
  }

  console.log(`Publishing package to ${registry}.`);

  authenticate(registry, token);

  console.log(`Successfully added credentials for ${registry}.`);

  await exec('npm', ['publish']);

  console.log(`Successfully published package to ${registry}.`);
};

const main = async (): Promise<void> => {
  await release();

  await publish(Registry.NPM, getInput('npm-token'));

  await publish(Registry.GITHUB, getInput('github-token'));
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
