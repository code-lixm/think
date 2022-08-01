#! /bin/bash

cd /apps/think
git checkout dev
git pull

pnpm install
pnpm run build

pm2 reload @think/server
pm2 reload @think/client
