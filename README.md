# Sensor manager API

A service built in `Typescript`, in charge of:

- Exposing API for [sensor manager](https://github.com/HPCMonitoring/sensor-manager) web service
- Managing and controlling [virtual sensor](https://github.com/HPCMonitoring/virtual-sensor) modules which run on HPC computers.
- Managing information of users who access HPC systems

Visit our [documentation](https://github.com/HPCMonitoring/docs) for more details.

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

## Helpful resources

### Prisma

- [Database schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Type mapping Prisma & PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql#type-mapping-between-postgresql-to-prisma-schema)
- [Schema references](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
