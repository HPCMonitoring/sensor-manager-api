ARG NODE_VERSION=18.13.0

################## Stage 1 ##################
FROM node:${NODE_VERSION}-alpine as development
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json tsconfig.compile.json .barrelsby.json jest.config.js ./
COPY ./src ./src
COPY ./prisma ./prisma

## for yarn prisma:generate (prisma/schema.prisma only can read environment from .env file)
COPY .env.production .env 

# Use for product optimization
RUN yarn install && yarn prisma:generate && yarn test:unit && yarn bundle

# # Use for product visualization
# RUN yarn install && yarn prisma:generate && yarn test:unit && yarn build

COPY ./prisma ./dist/prisma
COPY package.json yarn.lock ./dist/
COPY .env.production ./dist/.env

################## Stage 2 ##################
FROM node:${NODE_VERSION}-alpine as production
WORKDIR /usr/src/app

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist .

ENV NODE_ENV=production

EXPOSE 8080
CMD yarn prisma:push && node index.js