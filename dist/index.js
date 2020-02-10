"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const process_1 = require("process");
const semanticRelease = require("semantic-release");
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
const main = async () => {
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
        ]
    }, {
        cwd
    });
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map