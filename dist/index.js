"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const publish_1 = require("./publish");
const release_1 = require("./release");
const main = async () => {
    await release_1.release();
    await publish_1.publish(publish_1.Registry.NPM, publish_1.RegistryTokenEnvironmentVariable.NPM);
    await publish_1.publish(publish_1.Registry.GITHUB, publish_1.RegistryTokenEnvironmentVariable.GITHUB);
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map