import { getInput } from '@actions/core';
import { exists } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

export const existsAsync = promisify(exists);

export enum Flags {
  branch = 'BRANCH',
  dryRun = 'DRY_RUN',
  plugins = 'PLUGINS',
  scripts = 'SCRIPTS',
  debug = 'DEBUG',
  scriptPath = 'SCRIPT_PATH',
}

export const handleBranchFlag = (): { branch: string } | {} => {
  const branch: string = getInput(Flags.branch);

  if (branch.length > 0) {
    return {
      branch,
    };
  }

  return {};
};

export const handleDryRunFlag = (): { dryRun: boolean } => {
  const dryRunInput: boolean = getInput(Flags.dryRun) === 'true';

  return { dryRun: dryRunInput === true };
};

export const handleDebugFlag = (): boolean => getInput(Flags.debug) === 'true';

export const handleScriptPathFlag = async (): Promise<string | undefined> => {
  const scriptPathInput: string = getInput(Flags.scriptPath);

  if (scriptPathInput === '') {
    return undefined;
  }

  const absolutePath = resolve(scriptPathInput);

  const fileExists = await existsAsync(absolutePath);

  return fileExists === true
    ? scriptPathInput
    : Promise.reject(
        new Error(
          `The file specified in SCRIPT_PATH (${scriptPathInput}), ` +
            `resolved to ${absolutePath}, does not exist.`,
        ),
      );
};
