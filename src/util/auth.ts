/* eslint-disable no-sync */
import { exportVariable } from '@actions/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { cwd as currentWorkingDirectory } from 'process';

export enum Registry {
  GITHUB = 'npm.pkg.github.com',
  NPM = 'registry.npmjs.org'
}

export const authenticate = (registry: Registry): void => {
  const npmrcPath: string = path.resolve(currentWorkingDirectory(), '.npmrc');

  console.log(`Setting authentication in ${npmrcPath}.`);

  if (fs.existsSync(npmrcPath)) {
    console.log(`Discovered existing repository registry authentication, removing.`);

    fs.unlinkSync(npmrcPath);
  }

  const npmrcContents = `//${registry}/:_authToken=\${GITHUB_REGISTRY_TOKEN}${os.EOL}https://registry=${registry}${os.EOL}always-auth=true`;

  console.log(`Writing .npmrc: ${npmrcContents}`);

  fs.writeFileSync(npmrcPath, npmrcContents);

  exportVariable('NPM_CONFIG_USERCONFIG', npmrcPath);

  exportVariable('NODE_AUTH_TOKEN', 'XXXXX-XXXXX-XXXXX-XXXXX');
};
