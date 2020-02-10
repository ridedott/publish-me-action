import { exec } from '@actions/exec';

export const setup = async (): Promise<unknown> => {
  await exec('npm', ['install', '-g', 'semantic-release']);

  return import('semantic-release');
};
