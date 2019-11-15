export declare enum Flags {
    branch = "BRANCH",
    dryRun = "DRY_RUN",
    plugins = "PLUGINS",
    scripts = "SCRIPTS",
    debug = "DEBUG"
}
export declare const handleBranchFlag: () => {} | {
    branch: string;
};
export declare const handleDryRunFlag: () => {
    dryRun: boolean;
};
export declare const handleDebugFlag: () => boolean;
//# sourceMappingURL=handlers.d.ts.map