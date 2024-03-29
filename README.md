# Sensor manager API

A service built in `Typescript`, in charge of:

- Exposing API for [sensor manager](https://github.com/HPCMonitoring/sensor-manager) web service
- Managing and controlling [virtual sensor](https://github.com/HPCMonitoring/virtual-sensor) modules which run on HPC computers.
- Managing information of users who access HPC systems

Visit our [documentation](https://hpcmonitoring.github.io/docs) for more details.

## Prerequisites

- `docker` v20.10.22
- `docker-compose` v1.29.2
- `node` v18.13.0
- `npm` 8.19.3

## Commands

- `yarn bootstrap`: Set up development
- `yarn start`: Start application in dev mode
- `yarn db:reset`: Reset database and run seed
- `yarn db:reset:prod`: Reset database in **production** and run seed
- `yarn db:studio`: Inspect database and host as a web UI
- `yarn clean:git`: Clean local branches which were merged on remote

## Project structure

```py
📦src
 ┣ 📂configs        # Contain environment variables & app configurations
 ┣ 📂constants      # Constants and enums go here
 ┣ 📂handlers       # Handlers, which are responsible for handling core business logic
 ┣ 📂plugins        # Plugin, in charge of organizing api path & registering middleware
 ┣ 📂dtos           # Schema for input (from requests) & output (from responses)
 ┃ ┣ 📂in
 ┃ ┗ 📂out
 ┣ 📂types          # Types
 ┣ 📜prisma.ts      # Prisma instance (for connect & query database)
 ┣ 📜utils.ts       # Helping classes and functions
 ┗ 📜index.ts       # Program entry
```

## Project configurations

### VM max map count

```bash
sudo sysctl -w vm.max_map_count=262144
```

### Code linting & formating

We use [`eslint`](https://eslint.org/) to find and fix problem in code, such as:

- Unused variables
- Use `var` declaration
- Loosely comparation using `==`
- ...

You can run this command to test eslint script:

```bash
yarn lint
```

To maintain only one style coding across members, we use [`prettier`](https://prettier.io/). Try:

```bash
yarn format
```

You don't need to run these scripts regularly or before commiting code. They are run automatically before `git commit` command by setting as a precommit script. In some circumstances, precommit script is not enabled by default, just type two commands below to fix it:

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

For a tip, two plugins above could be installed in `VSCode` as extensions.

### Barrelsby & Path alias

```py
............
 ┣ 📂controllers
 ┃ ┗ 📜user.ctrler.ts
 ┣ 📂routes
 ┃ ┗ 📜user.route.ts
 ┣ 📂schemas
 ┃ ┣ 📂in
 ┃ ┃ ┣ 📜ids.schema.ts
 ┃ ┃ ┣ 📜user.schema.ts
 ┃ ┃ ┗ 📜index.ts
............
```

Imagine you are in `user.ctrler.ts` and want to import `ASchema` from `ids.schema.ts`. The code can be like this:

```typescript
import { ASchema } from '../schemas/in/ids.schema.ts'
```

The more nested folders, the more bad looking importation. It is waste time to guess how many `..` should be put in relative path.

The solution is [`barrelsby`](https://www.npmjs.com/package/barrelsby) and **path alias**. With configurations in `.barrelsby.json`, barrelsby can import your entire code base in a specific folder, and re-export them in `index.ts` file.

Try this:

```bash
yarn barrels
```

To avoid using many `..` in relative path, config path alias in `tsconfig.json`. See the guideline [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

## Git working culture

- For every updates, DO NOT push directly to `master` branch. Create a new branch, commit, publish branch and create a pull request (PR) instead.
- A branch should have prefix `features/` for a feature update, prefix `hotfixes/` for a hotfix, `improvs/` for an improvement ...
- A PR should be small enough to review. To split a large PR, use [stacked PRs](https://blog.logrocket.com/using-stacked-pull-requests-in-github/).

## Helpful resources

### Prisma

- [Database schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Type mapping Prisma & PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql#type-mapping-between-postgresql-to-prisma-schema)
- [Schema references](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
