import { setFailed } from '@actions/core';
import { env as environment } from 'process';
import * as semanticRelease from 'semantic-release';

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
      ]
    },
    {
      cwd
    }
  );
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
