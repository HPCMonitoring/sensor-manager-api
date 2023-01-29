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

## How to start

Run one command to set up for development:

```bash
yarn bootstrap
```

Start project:

```bash
yarn start
```

## Project structure

```py
📦src
 ┣ 📂configs                    # Contain environment variables & app configurations
 ┣ 📂constants                  # Constants and enums go here
 ┣ 📂controllers                # Controllers, which are responsible for handling incoming requests
 ┣ 📂routes                     # Routings, in charge of organizing api path & registering middleware
 ┣ 📂schemas                    # Schema for input (from requests) & output (from responses)
 ┃ ┣ 📂in
 ┃ ┗ 📂out
 ┣ 📂services                   # Core business logics should be implemented here
 ┣ 📂types                      # Types
 ┣ 📜exceptions.ts              # Contains custom exceptions
 ┣ 📜prisma.ts                  # Prisma instance (for connect & query database)
 ┣ 📜utils.ts                   # Helping classes and functions
 ┗ 📜index.ts                   # Program entry
```

## Project configurations

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

Notice that:

- You don't need to run these scripts regularly or before commiting code. They are run automatically before `git commit` command by setting as a precommit script.
- Two plugins above could be installed in `VSCode` as extensions.

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

The solution is [`barrelsby`](https://www.npmjs.com/package/barrelsby). With configurations in `.barrelsby.json`, barrelsby can import your entire code base in a specific folder, and re-export them in `index.ts` file.

Try this:

```bash
yarn barrels
```

## Git working culture

- For every updates, DO NOT push directly to `master` branch. Create a new branch, commit, publish branch and create a pull request (PR) instead.
- A branch should have prefix `features/` for a feature update, prefix `hotfixes/` for a hotfix, `improvs/` for an improvement ...
- A PR should be small enough to review. To split a large PR, use [stacked PRs](https://blog.logrocket.com/using-stacked-pull-requests-in-github/).

## Helpful resources

### Prisma

- [Database schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Type mapping Prisma & PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql#type-mapping-between-postgresql-to-prisma-schema)
- [Schema references](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
