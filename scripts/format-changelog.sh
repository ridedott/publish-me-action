#!/usr/bin/env sh

set -ex

SCRIPTS_PATH="$(cd "$(dirname "${0}")" >/dev/null 2>&1 && pwd)"
ROOT_PATH="$(dirname ${SCRIPTS_PATH})"

cd "${ROOT_PATH}"

if [[ ! -f CHANGELOG.md ]] ; then
    echo 'CHANGELOG.md not found, aborting.'
    exit
fi

npx prettier --write CHANGELOG.md
