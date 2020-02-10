import { setFailed } from '@actions/core';
import { env as environment } from 'process';

import { setup } from './setup';

const main = async (): Promise<void> => {
  const cwd =
    typeof environment.GITHUB_WORKSPACE === 'string'
      ? environment.GITHUB_WORKSPACE
      : '/github/workspace';

  const semanticRelease = await setup();

  // eslint-disable-next-line no-console
  console.log(cwd, semanticRelease);
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
