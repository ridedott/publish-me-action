#!/usr/bin/env sh

set -ex

SCRIPTS_PATH="$(cd "$(dirname "${0}")" >/dev/null 2>&1 && pwd)"
ROOT_PATH="$(dirname ${SCRIPTS_PATH})"

cd "${ROOT_PATH}"

npx prettier --write CHANGELOG.md
