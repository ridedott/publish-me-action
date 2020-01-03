# semantic-release-action

[![license: MIT](https://img.shields.io/github/license/ridedott/semantic-release-action)](https://github.com/ridedott/semantic-release-action/blob/master/LICENSE)
[![GitHub Actions Status](https://github.com/ridedott/auto-merge-action/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/ridedott/semantic-release-action/actions)
[![Coveralls](https://coveralls.io/repos/github/ridedott/semantic-release-action/badge.svg)](https://coveralls.io/github/ridedott/semantic-release-action)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Automatically releases new versions with
[Semantic Release](https://github.com/semantic-release/semantic-release).

## Usage

To start using the action, one needs to add a workflow file to a repository. For
a quick start, see a simple example:

```yaml
# .github/workflows/continuous-delivery.yaml

name: Continuous Delivery

on:
  push:
    branches:
      - master

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          # Fetch all history.
          fetch-depth: 0
          persist-credentials: false
      - name: Release
        uses: ridedott/semantic-release-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

For more advanced configuration options and examples, please refer to the
sections below.

### Environment variables

Environment variables are used to provide secrets to the action. Secrets can be
set for a repository in the
[`settings -> secrets`](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners#creating-and-using-secrets-encrypted-variables)
page.

- GITHUB_TOKEN [required string]

  Must be set to a GitHub token with the `repo` scopes enabled.

  If no branch protection is enabled, a default GitHub Actions token
  (`secrets.GITHUB_TOKEN`) can be used. However, if the branch protection is
  enabled, a
  [Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
  must be used instead with permissions to push to a chosen release branch.

  As an example, this repository uses a Personal Access Token of a user
  `DottBott`, which is a GitHub account registered with a purpose of performing
  automated actions.

- NPM_TOKEN: [required string] Must be set to an authentication token of a
  chosen npm registry. See the [examples](#examples) section on how to use this
  action with npm and GitHub Packages.

### Inputs

Inputs are used to configure the behavior of the action.

- `BRANCH`: [optional string, defaults to 'master']

  A git branch to release to.

- `DRY_RUN`: [optional boolean, defaults to false]

  Skips `prepare`, `publish` and `success` steps.

- `DEBUG`: [optional boolean, defaults to false]

  Outputs debug information for semantic-release plugins.

- `SCRIPT_PATH`: [optional string, defaults to '']

  Executes a script with @semantic-release/exec plugin. Scripts must have read
  and execute permissions.

## Examples

### Publish to GitHub Packages

1. Add a registry configuration to a `package.json` file:
   ```json
   {
     "publishConfig": {
       "access": "restricted",
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```
2. Use the following configuration of an action:

   ```yaml
   # .github/workflows/continuous-delivery.yaml

   name: Continuous Delivery

   on:
     push:
       branches:
         - master

   jobs:
     release:
       name: Release
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v2
           with:
             # Fetch all history.
             fetch-depth: 0
             persist-credentials: false
         - name: Release
           uses: ridedott/semantic-release-action@master
           env:
             # Use an automatically populated `GITHUB_TOKEN` environment
             # variable.
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             # `GITHUB_TOKEN` can also be used to authenticate with GitHub
             # Packages.
             NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

### Publish to npm

1. Add a registry configuration to a `package.json` file:
   ```json
   {
     "publishConfig": {
       "access": "restricted",
       "registry": "https://registry.npmjs.org"
     }
   }
   ```
2. Use the following configuration of an action:

   ```yaml
   # .github/workflows/continuous-delivery.yaml

   name: Continuous Delivery

   on:
     push:
       branches:
         - master

   jobs:
     release:
       name: Release
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v2
           with:
             # Fetch all history.
             fetch-depth: 0
             persist-credentials: false
         - name: Release
           uses: ridedott/semantic-release-action@master
           env:
             # Use an automatically populated `GITHUB_TOKEN` environment
             # variable.
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             # See https://docs.npmjs.com/about-authentication-tokens for
             # information on how to acquire a token.
             NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

### Publish to GitHub Packages with branch protection enabled

1. Add a registry configuration to a `package.json` file:
   ```json
   {
     "publishConfig": {
       "access": "restricted",
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```
2. Use the following configuration of an action:

   ```yaml
   # .github/workflows/continuous-delivery.yaml

   name: Continuous Delivery

   on:
     push:
       branches:
         - master

   jobs:
     release:
       name: Release
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v2
           with:
             # Fetch all history.
             fetch-depth: 0
             persist-credentials: false
         - name: Release
           uses: ridedott/semantic-release-action@master
           env:
             # Use a manually populated `GITHUB_TOKEN_WORKAROUND` environment
             # variable with permissions to push to a protected branch. This
             # variable can have an arbitrary name, as an example, this
             # repository uses `GITHUB_TOKEN_DOTTBOTT`. It is recommended
             # to leave the following comment for other developers to be
             # aware of the reasoning behind it:
             #
             # This must be used as GitHub Actions token does not support
             # pushing to protected branches.
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN_WORKAROUND }}
             # Regular `GITHUB_TOKEN` can be used to authenticate with GitHub
             # Packages, but a custom `GITHUB_TOKEN_WORKAROUND` can also be used
             # as long as it has `packages:write` permission granted.
             NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

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
