"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cspell:ignore npmjs, userconfig
/* eslint-disable no-sync */
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const fs = require("fs");
const os = require("os");
const path = require("path");
const process_1 = require("process");
var Registry;
(function (Registry) {
    Registry["GITHUB"] = "npm.pkg.github.com";
    Registry["NPM"] = "registry.npmjs.org";
})(Registry = exports.Registry || (exports.Registry = {}));
var RegistryTokenEnvironmentVariable;
(function (RegistryTokenEnvironmentVariable) {
    RegistryTokenEnvironmentVariable["GITHUB"] = "GITHUB_REGISTRY_TOKEN";
    RegistryTokenEnvironmentVariable["NPM"] = "NPM_REGISTRY_TOKEN";
})(RegistryTokenEnvironmentVariable = exports.RegistryTokenEnvironmentVariable || (exports.RegistryTokenEnvironmentVariable = {}));
const getRegistryAuthTokenEnvironmentVariableName = (registry) => {
    if (registry === Registry.GITHUB) {
        return RegistryTokenEnvironmentVariable.GITHUB;
    }
    return RegistryTokenEnvironmentVariable.NPM;
};
exports.authenticate = (registry) => {
    const npmrcPath = path.resolve(process_1.cwd(), '.npmrc');
    if (fs.existsSync(npmrcPath)) {
        fs.unlinkSync(npmrcPath);
    }
    const tokenEnvironmentVariable = getRegistryAuthTokenEnvironmentVariableName(registry);
    const npmrcContents = `//${registry}/:_authToken=\${${tokenEnvironmentVariable}}${os.EOL}registry=https://${registry}${os.EOL}always-auth=true`;
    fs.writeFileSync(npmrcPath, npmrcContents);
    core_1.exportVariable('NPM_CONFIG_USERCONFIG', npmrcPath);
    core_1.exportVariable('NODE_AUTH_TOKEN', 'XXXXX-XXXXX-XXXXX-XXXXX');
};
exports.publish = async (registry) => {
    exports.authenticate(registry);
    await exec_1.exec('npm', ['publish']);
};
//# sourceMappingURL=publish.js.map