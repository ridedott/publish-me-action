import { setFailed } from '@actions/core';

import { publish, Registry, RegistryTokenEnvironmentVariable } from './publish';
import { release } from './release';

const main = async (): Promise<void> => {
  await release();

  await publish(Registry.NPM, RegistryTokenEnvironmentVariable.NPM);

  await publish(Registry.GITHUB, RegistryTokenEnvironmentVariable.GITHUB);
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
