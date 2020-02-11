export declare enum Registry {
    GITHUB = "npm.pkg.github.com",
    NPM = "registry.npmjs.org"
}
export declare enum RegistryTokenEnvironmentVariable {
    GITHUB = "GITHUB_REGISTRY_TOKEN",
    NPM = "NPM_REGISTRY_TOKEN"
}
export declare const authenticate: (registry: Registry) => void;
export declare const publish: (registry: Registry) => Promise<void>;
//# sourceMappingURL=publish.d.ts.map