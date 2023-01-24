ARG NODE_VERSION=18.13.0

################## Stage 1 ##################
FROM node:${NODE_VERSION}-alpine as development
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json tsconfig.compile.json jest.config.js ./
COPY ./src ./src
COPY ./prisma ./prisma

## for yarn prisma:generate (prisma/schema.prisma only can read environment from .env file)
COPY .env.production .env 

RUN yarn install && yarn prisma:generate && yarn test:unit && yarn build

COPY ./prisma ./dist/prisma
COPY package.json yarn.lock ./dist/
COPY .env.production ./dist/.env

################## Stage 2 ##################
FROM node:${NODE_VERSION}-alpine as production
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --chown=node:node --from=development /usr/src/app/dist .
RUN yarn install --production=true

EXPOSE 8080
CMD yarn prisma:migrate && node index.js