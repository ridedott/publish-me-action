"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-sync */
const core_1 = require("@actions/core");
const fs = require("fs");
const os = require("os");
const path = require("path");
const process_1 = require("process");
var Registry;
(function (Registry) {
    Registry["GITHUB"] = "npm.pkg.github.com";
    Registry["NPM"] = "registry.npmjs.org";
})(Registry = exports.Registry || (exports.Registry = {}));
exports.authenticate = (registry, token) => {
    const npmrcPath = path.resolve(process_1.cwd(), '.npmrc');
    core_1.debug(`Setting authentication in ${npmrcPath}.`);
    if (fs.existsSync(npmrcPath)) {
        core_1.debug(`Discovered existing repository registry authentication, removing.`);
        fs.unlinkSync(npmrcPath);
    }
    const npmrcContents = `//${registry}/:_authToken=${token}${os.EOL}registry=${registry}${os.EOL}always-auth=true`;
    fs.writeFileSync(npmrcPath, npmrcContents);
    core_1.exportVariable('NPM_CONFIG_USERCONFIG', npmrcPath);
};
//# sourceMappingURL=auth.js.map