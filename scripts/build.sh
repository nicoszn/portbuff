#!/bin/sh
set -eu
# Deploy environments can have a restricted PATH.
# Do not rely on node_modules/.bin or npx resolution.
exec node ./node_modules/vite/bin/vite.js build
