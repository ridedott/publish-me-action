// cspell:ignore eslintignore

import { Commit } from 'conventional-commits-parser';

/**
 * This transform function is a modified copy of
 * Angular preset for https://github.com/semantic-release/commit-analyzer
 * to support release notes and changelog entries generation for all types of commit messages:
 * https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular
 * Ignored in .eslintignore to speedup development of action. Same reasoning for usage of @ts-ignore annotations
 */
export const transform = (originalCommit: Commit, context) => {
  const issues = [];

  originalCommit.notes.forEach(note => {
    note.title = `BREAKING CHANGES`;
  });

  if (originalCommit.type === `feat`) {
    originalCommit.type = `Features`;
  } else if (originalCommit.type === `fix`) {
    originalCommit.type = `Bug Fixes`;
  } else if (originalCommit.type === `perf`) {
    originalCommit.type = `Performance Improvements`;
  } else if (originalCommit.type === `revert`) {
    originalCommit.type = `Reverts`;
  } else if (originalCommit.type === `docs`) {
    originalCommit.type = `Documentation`;
  } else if (originalCommit.type === `style`) {
    originalCommit.type = `Styles`;
  } else if (originalCommit.type === `refactor`) {
    originalCommit.type = `Code Refactoring`;
  } else if (originalCommit.type === `test`) {
    originalCommit.type = `Tests`;
  } else if (originalCommit.type === `build`) {
    originalCommit.type = `Build System`;
  } else if (originalCommit.type === `ci`) {
    originalCommit.type = `Continuous Integration`;
  } else if (originalCommit.type === `chore`) {
    originalCommit.type = `Chores`;
  } else {
    return;
  }

  if (originalCommit.scope === `*`) {
    originalCommit.scope = '';
  }

  if (typeof originalCommit.hash === `string`) {
    originalCommit.shortHash = originalCommit.hash.substring(0, 7);
  }

  if (typeof originalCommit.subject === `string`) {
    let url = context.repository
      ? `${context.host}/${context.owner}/${context.repository}`
      : context.repoUrl;
    if (url) {
      url = `${url}/issues/`;
      // Issue URLs.
      originalCommit.subject = originalCommit.subject.replace(
        /#([0-9]+)/g,
        (_, issue: string) => {
          // @ts-ignore
          issues.push(issue);
          return `[#${issue}](${url}${issue})`;
        },
      );
    }
    if (context.host) {
      // User URLs.
      originalCommit.subject = originalCommit.subject.replace(
        /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
        (_, username) => {
          if (username.includes('/')) {
            return `@${username}`;
          }

          return `[@${username}](${context.host}/${username})`;
        },
      );
    }
  }

  // remove references that already appear in the subject
  originalCommit.references = originalCommit.references.filter(reference => {
    // @ts-ignore
    if (issues.indexOf(reference.issue) === -1) {
      return true;
    }

    return false;
  });

  return originalCommit;
};
