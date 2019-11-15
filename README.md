# semantic-release-action

[![license: MIT](https://img.shields.io/github/license/ridedott/semantic-release-action)](https://github.com/ridedott/semantic-release-action/blob/master/LICENSE)
[![GitHub Actions Status](https://github.com/ridedott/auto-merge-action/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/ridedott/semantic-release-action/actions)
[![Coveralls](https://coveralls.io/repos/github/ridedott/semantic-release-action/badge.svg)](https://coveralls.io/github/ridedott/semantic-release-action)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Automatically releases new versions with
[Semantic Release](https://github.com/semantic-release/semantic-release).

## Usage

Add
[required secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners#creating-and-using-secrets-encrypted-variables)
in your repository (settings -> secrets).

Personal `GITHUB_TOKEN_WORKAROUND` token (scopes enabled: `read:packages`,
`repo`, `write:packages`) is used as `GITHUB_TOKEN` because GitHub Actions token
does not support pushing to protected branches.

Add a workflow file to your repository to create custom automated processes.

### Inputs

- BRANCH: [Optional] Boolean value expected. Git branch to release from. If not
  provided master branch will be used for release.
- DRY_RUN: [Optional] String value expected. Dry-run skips `prepare`, `publish`
  and `success` steps. If not provided defaults to false.
- DEBUG: [Optional] Boolean value expected. Outputs debug information for
  semantic-release plugins. If not provided, defaults to false.

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See usage notes on how to
consume this package in your project.

### Prerequisites

Minimal requirements to set up the project:

- [Node.js](https://nodejs.org/en) v12, installation instructions can be found
  on the official website, a recommended installation option is to use
  [Node Version Manager](https://github.com/creationix/nvm#readme). It can be
  installed in a
  [few commands](https://nodejs.org/en/download/package-manager/#nvm).
- A package manager [npm](https://www.npmjs.com). All instructions in the
  documentation will follow the npm syntax.
- Optionally a [Git](https://git-scm.com) client.

### Installing

Start by cloning the repository:

```bash
git clone git@github.com:ridedott/semantic-release-action.git
```

In case you don't have a git client, you can get the latest version directly by
using
[this link](https://github.com/ridedott/semantic-release-action/archive/master.zip)
and extracting the downloaded archive.

Go the the right directory and install dependencies:

```bash
cd semantic-release-action
npm install
```

That's it! You can now go to the next step.

## Tests

All tests are being executed using [Jest](https://jestjs.io/). All tests files
live side-to-side with a source code and have a common suffix: `.spec.ts`.

There are three helper scripts to run tests in the most common scenarios:

```shell
npm run test
npm run test:watch
npm run test:coverage
```

### Formatting

This project uses [Prettier](https://prettier.io) to automate formatting. All
supported files are being reformatted in a pre-commit hook. You can also use one
of the two scripts to validate and optionally fix all of the files:

```bash
npm run format
npm run format:fix
```

### Linting

This project uses [ESLint](https://eslint.org) to enable static analysis.
TypeScript files are linted using a [custom configuration](./.eslintrc). You can
use one of the following scripts to validate and optionally fix all of the
files:

```bash
npm run lint
npm run lint:fix
```

## Publishing

Publishing is handled in an automated way and must not be performed manually.

Each commit to the master branch is automatically tagged using
[`semantic-release`](https://github.com/semantic-release/semantic-release).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

### Automation

- [Dependabot](https://dependabot.com/)
- [GitHub Actions](https://github.com/features/actions)

### Source

- [TypeScript](https://www.typescriptlang.org)

## Versioning

This project adheres to [Semantic Versioning](http://semver.org) v2.
