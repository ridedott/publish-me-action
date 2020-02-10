"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const main = async () => {
    console.log('aaa');
};
main().catch((error) => {
    core_1.setFailed(JSON.stringify(error));
});
//# sourceMappingURL=index.js.map