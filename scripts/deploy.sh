#! /bin/bash

cd /apps/think
git checkout dev
git pull

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
