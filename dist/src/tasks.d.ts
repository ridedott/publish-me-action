import { Result } from 'semantic-release';
export declare enum Commands {
    CreateGitIgnoreBackup = "createGitIgnoreBackup",
    RemoveNpmrc = "removeNpmrc"
}
export declare const reportResults: (result: Result) => Promise<void>;
export declare const runTask: (task: Commands) => Promise<void>;
//# sourceMappingURL=tasks.d.ts.map