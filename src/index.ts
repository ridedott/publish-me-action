import { setFailed } from '@actions/core';

const main = async (): Promise<void> => {
  console.log('aaa');
};

main().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
