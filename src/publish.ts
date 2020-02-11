// cspell:ignore npmjs, userconfig
/* eslint-disable no-sync */
import { exportVariable } from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { cwd as currentWorkingDirectory } from 'process';

export enum Registry {
  GITHUB = 'npm.pkg.github.com',
  NPM = 'registry.npmjs.org',
}

export enum RegistryTokenEnvironmentVariable {
  GITHUB = 'GITHUB_REGISTRY_TOKEN',
  NPM = 'NPM_REGISTRY_TOKEN',
}

const getRegistryAuthTokenEnvironmentVariableName = (
  registry: Registry,
): RegistryTokenEnvironmentVariable => {
  if (registry === Registry.GITHUB) {
    return RegistryTokenEnvironmentVariable.GITHUB;
  }

  return RegistryTokenEnvironmentVariable.NPM;
};

export const authenticate = (registry: Registry): void => {
  const npmrcPath: string = path.resolve(currentWorkingDirectory(), '.npmrc');

  if (fs.existsSync(npmrcPath)) {
    fs.unlinkSync(npmrcPath);
  }

  const tokenEnvironmentVariable = getRegistryAuthTokenEnvironmentVariableName(
    registry,
  );

  const npmrcContents = `//${registry}/:_authToken=\${${tokenEnvironmentVariable}}${os.EOL}registry=https://${registry}${os.EOL}always-auth=true`;

  fs.writeFileSync(npmrcPath, npmrcContents);

  exportVariable('NPM_CONFIG_USERCONFIG', npmrcPath);

  exportVariable('NODE_AUTH_TOKEN', 'XXXXX-XXXXX-XXXXX-XXXXX');
};

export const publish = async (registry: Registry): Promise<void> => {
  authenticate(registry);

  await exec('npm', ['publish']);
};
