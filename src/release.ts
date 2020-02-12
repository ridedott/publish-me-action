import { Commit } from 'conventional-commits-parser';
import { env as environment } from 'process';
import * as semanticRelease from 'semantic-release';

const SHORT_HASH_LENGTH = 7;

const transformCommitType = (inputType: string): string => {
  switch (inputType) {
    case 'feat':
      return 'Features';
    case 'fix':
      return 'Bug Fixes';
    case 'revert':
      return 'Reverts';
    case 'docs':
      return 'Documentation';
    case 'refactor':
      return 'Code Refactoring';
    case 'test':
      return 'Tests';
    case 'build':
      return 'Build System';
    case 'ci':
      return 'Continuous Integration';
    default:
      return 'Chores';
  }
};

const transform = (
  commit: Commit,
): Commit => {
  const notes = commit.notes.map(
    (note: Commit.Note): Commit.Note => ({
      ...note,
      title: `BREAKING CHANGES`,
    }),
  );

  const type = transformCommitType(
    typeof commit.type === 'string' ? commit.type : 'chore',
  );

  const scope = commit.scope === '*' ? '' : commit.scope;

  const shortHash =
    typeof commit.hash === 'string'
      ? commit.hash.slice(0, SHORT_HASH_LENGTH)
      : undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    ...commit,
    notes,
    scope,
    shortHash,
    type,
  };
};

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
  transform,
};

export const release = async (): Promise<void> => {
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
            writerOpts: releaseNotesGeneratorWriterOptions,
          },
        ],
        '@semantic-release/changelog',
        [
          '@semantic-release/npm',
          {
            npmPublish: false,
          },
        ],
        [
          '@semantic-release/git',
          {
            assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
            // eslint-disable-next-line no-template-curly-in-string
            message: 'chore(release): ${nextRelease.version} [skip ci]',
          },
        ],
      ],
    },
    {
      cwd: typeof environment.GITHUB_WORKSPACE === 'string'
        ? environment.GITHUB_WORKSPACE
        : '/github/workspace',
    },
  );
};
