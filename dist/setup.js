"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("@actions/exec");
exports.setup = async () => {
    await exec_1.exec('npm', [
        'install',
        '-g',
        'semantic-release'
    ]);
    return Promise.resolve().then(() => require('semantic-release'));
};
//# sourceMappingURL=setup.js.map