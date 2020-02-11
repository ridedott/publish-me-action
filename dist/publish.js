"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.authenticate = (registry, tokenEnvironmentVariable) => {
    const npmrcPath = path.resolve(process_1.cwd(), '.npmrc');
    console.log(`Setting authentication in ${npmrcPath}.`);
    if (fs.existsSync(npmrcPath)) {
        console.log(`Discovered existing repository registry authentication, removing.`);
        fs.unlinkSync(npmrcPath);
    }
    const npmrcContents = `//${registry}/:_authToken=\${${tokenEnvironmentVariable}}${os.EOL}registry=https://${registry}${os.EOL}always-auth=true`;
    console.log(`Writing .npmrc: ${npmrcContents}`);
    fs.writeFileSync(npmrcPath, npmrcContents);
    core_1.exportVariable('NPM_CONFIG_USERCONFIG', npmrcPath);
    core_1.exportVariable('NODE_AUTH_TOKEN', 'XXXXX-XXXXX-XXXXX-XXXXX');
};
exports.publish = async (registry, tokenEnvironmentVariable) => {
    console.log(`Publishing package to ${registry}.`);
    exports.authenticate(registry, tokenEnvironmentVariable);
    console.log(`Successfully added credentials for ${registry}.`);
    await exec_1.exec('npm', ['publish']);
    console.log(`Successfully published package to ${registry}.`);
};
//# sourceMappingURL=publish.js.map