import { error as logError, info as logInfo } from '@actions/core';
import { exec } from 'child_process';
import { Result } from 'semantic-release';
import { promisify } from 'util';

const execAsync = promisify(exec);

export enum Commands {
  RemoveNpmrc = 'removeNpmrc',
  PreInstallPlugins = 'preInstallPlugins',
}

const runCommand = async (command: string): Promise<void> => {
  logInfo(`Running command: ${command}`);
  const { stdout, stderr } = await execAsync(command);
  logInfo(stdout);

  if (stderr.length > 0) {
    // Only log error here as NPM warnings are treated as errors in exec.
    logError(stderr);
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
    case Commands.RemoveNpmrc:
      /**
       * Remove .npmrc file from the repository during release where this action
       * is used.
       */

      return runCommand('rm -f .npmrc');
    case Commands.PreInstallPlugins:
      /**
       * Install semantic-release and semantic-release plugins inside of
       * the repository during release where this action is used.
       */

      return runCommand(`npm install \
        --no-save \
        semantic-release@15.14.0 \
        @semantic-release/changelog@3.0.6 \
        @semantic-release/commit-analyzer@6.3.3 \
        @semantic-release/exec@3.3.8 \
        @semantic-release/git@7.0.18 \
        @semantic-release/npm@5.3.5 \
        @semantic-release/release-notes-generator@7.3.5`);
    default:
      throw new Error(`task ${task} not found`);
  }
};
