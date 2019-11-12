import { GitHub } from '@actions/github';

export const pushHandle = async (octokit: GitHub): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('debug', octokit.checks);
};
