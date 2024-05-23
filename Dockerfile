FROM node:18 as build

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN chmod +x ./init/init-database.sql
RUN chmod +x ./init/init-migrate.sh
RUN npx prisma generate
RUN npm run build

FROM node:18-slim

RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/init ./init

RUN npm install --omit=dev

ENV NODE_ENV production

# EXPOSE 3000

CMD ["./init/init-migrate.sh"]

# CMD ["dumb-init", "node", "dist/src/main"]