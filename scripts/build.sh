#!/usr/bin/env sh

set -ex

SCRIPT_PATH="$(cd "$(dirname "${0}")" >/dev/null 2>&1 && pwd)"
ROOT_PATH="$(dirname ${SCRIPT_PATH})"

cd "${ROOT_PATH}"

ncc build ./src/index.ts \
--minify \
--source-map \
--v8-cache \
--out dist \
--external @semantic-release/changelog \
--external @semantic-release/commit-analyzer \
--external @semantic-release/git \
--external @semantic-release/npm \
--external @semantic-release/release-notes-generator
