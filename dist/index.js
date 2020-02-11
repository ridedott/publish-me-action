"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const process_1 = require("process");
const semanticRelease = require("semantic-release");
const auth_1 = require("./util/auth");
const transform_1 = require("./util/transform");
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
    transform: transform_1.transform
};
const release = async () => {
    const cwd = typeof process_1.env.GITHUB_WORKSPACE === 'string'
        ? process_1.env.GITHUB_WORKSPACE
        : '/github/workspace';
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
    }, {
        cwd
    });
};
const publish = async (registry) => {
    console.log(`Publishing package to ${registry}.`);
    auth_1.authenticate(registry);
    console.log(`Successfully added credentials for ${registry}.`);
    await exec_1.exec('npm', ['publish']);
    console.log(`Successfully published package to ${registry}.`);
};
const main = async () => {
    await release();
    // await publish(Registry.NPM);
    await publish(auth_1.Registry.GITHUB);
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map