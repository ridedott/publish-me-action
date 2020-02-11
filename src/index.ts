import { setFailed } from '@actions/core';
import { env as environment } from 'process';

import { publish, Registry, RegistryTokenEnvironmentVariable } from './publish';
import { release } from './release';

const main = async (): Promise<void> => {
  if (
    typeof environment.GITHUB_TOKEN === 'string' &&
    environment.GITHUB_TOKEN.length > 0
  ) {
    await release();
  } else {
    throw new Error('Missing required GITHUB_TOKEN environment variable.');
  }

  const npmToken = environment[RegistryTokenEnvironmentVariable.NPM];

  if (typeof npmToken === 'string' && npmToken.length > 0) {
    await publish(Registry.NPM);
  }

  const githubToken = environment[RegistryTokenEnvironmentVariable.GITHUB];

  if (typeof githubToken === 'string' && githubToken.length > 0) {
    await publish(Registry.GITHUB);
  }
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
