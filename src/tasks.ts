import { error as logError, info as logInfo } from '@actions/core';
import { exec } from 'child_process';
import { Result } from 'semantic-release';
import { promisify } from 'util';

const execAsync = promisify(exec);

export enum Commands {
  CreateGitIgnoreBackup = 'createGitIgnoreBackup',
  RemoveNpmrc = 'removeNpmrc',
}

const runCommand = async (command: string): Promise<void> => {
  logInfo(`Running command: ${command}`);
  const { stdout, stderr } = await execAsync(command);
  logInfo(stdout);

  if (stderr.length > 0) {
    logError(stderr);
    throw new Error(stderr);
  }
};

export const reportResults = async (result: Result): Promise<void> => {
  if (result === false) {
    logInfo('No new release published.');

    return;
  }

  const { nextRelease } = result;

  logInfo(
    `
      Published release type: ${nextRelease.type}.
      Version: ${nextRelease.version}.
    `,
  );
};

export const runTask = async (task: Commands): Promise<void> => {
  switch (task) {
    case Commands.CreateGitIgnoreBackup:
      return runCommand("sed -i.bak -e '/dist/d' .gitignore");
    case Commands.RemoveNpmrc:
      return runCommand('rm -rf .npmrc');
    default:
      throw new Error(`task ${task} not found`);
  }
};
