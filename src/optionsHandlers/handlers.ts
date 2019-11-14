import { getInput } from '@actions/core';

export enum Flags {
  branch = 'BRANCH',
  dryRun = 'DRY_RUN',
  plugins = 'PLUGINS',
  scripts = 'SCRIPTS',
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
