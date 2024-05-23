#!/bin/bash

npx prisma db push
dumb-init node dist/src/main