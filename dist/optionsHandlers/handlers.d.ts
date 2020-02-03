/// <reference types="node" />
import { exists } from 'fs';
export declare const existsAsync: typeof exists.__promisify__;
export declare enum Flags {
    branch = "BRANCH",
    dryRun = "DRY_RUN",
    plugins = "PLUGINS",
    scripts = "SCRIPTS",
    debug = "DEBUG",
    scriptPath = "SCRIPT_PATH"
}
export declare const handleBranchFlag: () => {} | {
    branch: string;
};
export declare const handleDryRunFlag: () => {
    dryRun: boolean;
};
export declare const handleDebugFlag: () => boolean;
export declare const handleScriptPathFlag: () => Promise<string | undefined>;
//# sourceMappingURL=handlers.d.ts.map