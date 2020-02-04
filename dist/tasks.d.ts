import { Result } from 'semantic-release';
export declare enum Commands {
    RemoveNpmrc = "removeNpmrc",
    PreInstallPlugins = "preInstallPlugins"
}
export declare const reportResults: (result: Result) => Promise<void>;
export declare const runTask: (task: Commands) => Promise<void>;
