"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const semanticRelease = require("semantic-release");
const SHORT_HASH_LENGTH = 7;
const transformCommitType = (inputType) => {
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
const transform = (commit) => {
    const notes = commit.notes.map((note) => (Object.assign(Object.assign({}, note), { title: `BREAKING CHANGES` })));
    const type = transformCommitType(typeof commit.type === 'string' ? commit.type : 'chore');
    const scope = commit.scope === '*' ? '' : commit.scope;
    const shortHash = typeof commit.hash === 'string'
        ? commit.hash.slice(0, SHORT_HASH_LENGTH)
        : undefined;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.assign(Object.assign({}, commit), { notes,
        scope,
        shortHash,
        type });
};
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
const releaseNotesGeneratorWriterOptions = {
    transform,
};
exports.release = async () => {
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
    }, {
        cwd: typeof process_1.env.GITHUB_WORKSPACE === 'string'
            ? process_1.env.GITHUB_WORKSPACE
            : '/github/workspace',
    });
};
//# sourceMappingURL=release.js.map