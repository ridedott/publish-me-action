/* eslint-disable no-sync */
import { exportVariable } from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { cwd as currentWorkingDirectory } from 'process';


export enum Registry {
  GITHUB = 'npm.pkg.github.com',
  NPM = 'registry.npmjs.org'
}

export enum RegistryTokenEnvironmentVariable {
  GITHUB = 'GITHUB_REGISTRY_TOKEN',
  NPM = 'NPM_REGISTRY_TOKEN'
}

export const authenticate = (registry: Registry, tokenEnvironmentVariable: RegistryTokenEnvironmentVariable): void => {
  const npmrcPath: string = path.resolve(currentWorkingDirectory(), '.npmrc');

  console.log(`Setting authentication in ${npmrcPath}.`);

  if (fs.existsSync(npmrcPath)) {
    console.log(`Discovered existing repository registry authentication, removing.`);

    fs.unlinkSync(npmrcPath);
  }

  const npmrcContents = `//${registry}/:_authToken=\${${tokenEnvironmentVariable}}${os.EOL}registry=https://${registry}${os.EOL}always-auth=true`;

  console.log(`Writing .npmrc: ${npmrcContents}`);

  fs.writeFileSync(npmrcPath, npmrcContents);

  exportVariable('NPM_CONFIG_USERCONFIG', npmrcPath);

  exportVariable('NODE_AUTH_TOKEN', 'XXXXX-XXXXX-XXXXX-XXXXX');
};

export const publish = async (registry: Registry, tokenEnvironmentVariable: RegistryTokenEnvironmentVariable): Promise<void> => {
  console.log(`Publishing package to ${registry}.`);

  authenticate(registry, tokenEnvironmentVariable);

  console.log(`Successfully added credentials for ${registry}.`);

  await exec('npm', ['publish']);

  console.log(`Successfully published package to ${registry}.`);
};
