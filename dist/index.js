"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const process_1 = require("process");
const setup_1 = require("./setup");
const main = async () => {
    const cwd = typeof process_1.env.GITHUB_WORKSPACE === 'string'
        ? process_1.env.GITHUB_WORKSPACE
        : '/github/workspace';
    const semanticRelease = await setup_1.setup();
    // eslint-disable-next-line no-console
    console.log(cwd, semanticRelease);
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map