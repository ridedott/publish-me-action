"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const process_1 = require("process");
const publish_1 = require("./publish");
const release_1 = require("./release");
const main = async () => {
    if (typeof process_1.env.GITHUB_TOKEN === 'string' &&
        process_1.env.GITHUB_TOKEN.length > 0) {
        await release_1.release();
    }
    else {
        throw new Error('Missing required GITHUB_TOKEN environment variable.');
    }
    const npmToken = process_1.env[publish_1.RegistryTokenEnvironmentVariable.NPM];
    if (typeof npmToken === 'string' && npmToken.length > 0) {
        await publish_1.publish(publish_1.Registry.NPM);
    }
    const githubToken = process_1.env[publish_1.RegistryTokenEnvironmentVariable.GITHUB];
    if (typeof githubToken === 'string' && githubToken.length > 0) {
        await publish_1.publish(publish_1.Registry.GITHUB);
    }
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map